import type { Hono } from 'hono';
import { errors, jwtVerify } from 'jose';
import type { AppEnv } from '../app-env';
import { allowIfAnyOf, extractUser } from '../middleware/auth';
import * as identityDb from '../db/queries/identity';
import * as profileDb from '../db/queries/profile';
import {
  sendContactUsEmail,
  sendPasswordChangeConfirmation,
  sendPasswordResetEmail,
  sendProfileRegistrationNotification,
  sendVerificationEmail
} from '../services/email';
import { encryptString, readStoredBcryptHash } from '../utils/crypto';
import { text, readJsonBody } from '../utils/http';
import { signCubeJwt } from '../utils/jwt';
import { comparePassword, hashPassword } from '../utils/passwords';
import { canonicalUuid, encodeUuidBase36, UUID_REGEXP } from '../utils/uuid';
import { validateUserCreateInput } from '../utils/validate-user';

function schemaOf(env: { DB_SCHEMA?: string }): string {
  return env.DB_SCHEMA || 'cube';
}

/** Stored password cannot be read with the current ENCRYPT_SECRET. The reset email was sent. */
export const PASSWORD_RESET_REQUIRED = 'PASSWORD_RESET_REQUIRED';

export function registerIdentity(app: Hono<AppEnv>): void {
  app.post('/auth/user', allowIfAnyOf('anonymous'), async (c) => {
    const body = await readJsonBody(c);
    if (!body) return text(c, 'Invalid JSON', 400);
    const { errors, value } = validateUserCreateInput(body);
    if (errors.length > 0) return c.json({ errors }, 400);

    const hasAcceptedNewsletter = Boolean(body.hasAcceptedNewsletter);
    const hasAcceptedTerms = Boolean(body.hasAcceptedTerms);
    const isOver18 = Boolean(body.isOver18);
    const sql = c.get('sql');
    const schema = schemaOf(c.env);

    try {
      const hashedPassword = await hashPassword(value.password);
      const encryptedPassword = encryptString(hashedPassword, c.env.ENCRYPT_SECRET);
      const permissionIds = ['anonymous'];
      let profileId = '';

      if (value.organization || value.website || value.tag) {
        try {
          // The old route called he.decode(website) before insert. A missing website throws.
          if (value.website === undefined) throw new TypeError('Expected a string');
          const created = await profileDb.insertProfile(sql, schema, value.organization ?? '', value.website, value.tag ?? '');
          profileId = created.id;
          permissionIds.push('contentEditor');
          await sendProfileRegistrationNotification(c.env, value.name, value.email, value.organization ?? '', value.website ?? '', value.tag ?? '');
        } catch (error) {
          console.error('Error creating profile for user. Organization name, website or tag already exist', value.organization, value.website, value.tag, error);
          return text(c, 'Error creating profile for user. Organization name, website, or tag already exists', 400);
        }
      }

      const user = await identityDb.insertIdentity(
        sql,
        schema,
        value.name,
        value.email,
        profileId,
        encryptedPassword,
        hasAcceptedNewsletter,
        hasAcceptedTerms,
        isOver18,
        permissionIds
      );
      const token = await signCubeJwt({ sub: encodeUuidBase36(user.id), aud: ['unverified'] }, c.env.JWT_TOKEN_SECRET, '7d');
      await sendVerificationEmail(c.env, value.name, value.email, token);
      return c.json({ id: user.id, jwt: token }, 201);
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      if (message.includes('duplicate key')) {
        console.error('Email already exists', error);
        return text(c, 'Email already exists', 400);
      }
      console.error('Error creating account', error);
      return text(
        c,
        'Error creating account. Are you sure this profile does not already exist? Or that you have used this email for another account on CubeCommons?',
        500
      );
    }
  });

  app.post('/auth/login', allowIfAnyOf('anonymous'), async (c) => {
    const body = await readJsonBody(c);
    if (!body) return text(c, 'Invalid JSON', 400);
    const email = typeof body.email === 'string' ? body.email : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (!email || !password) return text(c, 'Invalid request body. Username and password must be provided.', 401);

    try {
      const sql = c.get('sql');
      const schema = schemaOf(c.env);
      const user = await identityDb.selectUserByEmail(sql, schema, email);
      if (!user) return text(c, 'Invalid email or password', 403);
      const storedHash = readStoredBcryptHash(user.password, c.env.ENCRYPT_SECRET);
      if (!storedHash) {
        await sendPasswordResetEmail(c.env, sql, schema, email);
        return c.json({ code: PASSWORD_RESET_REQUIRED }, 403);
      }
      if (!(await comparePassword(password, storedHash))) return text(c, 'Invalid email or password', 403);

      const token = await signCubeJwt(
        { sub: user.id, aud: user.permission_ids ?? [] },
        c.env.JWT_TOKEN_SECRET,
        '14d'
      );
      return c.json({
        jwt: token,
        user: {
          uuid: user.id,
          name: user.name,
          email: user.email,
          permission_ids: user.permission_ids,
          is_active: user.is_active,
          has_verified_email: user.has_verified_email,
          has_accepted_terms: user.has_accepted_terms,
          profile_id: user.profile_id,
          isOver18: user.is_over_18
        }
      });
    } catch (error) {
      console.error('Error occurred during authentication:', error);
      return text(c, 'Error occurred during authentication', 500);
    }
  });

  app.post('/auth/anonymous', async (c) => {
    try {
      const token = await signCubeJwt(
        { sub: '00000000-0000-0000-0000-000000000000', aud: ['anonymous'] },
        c.env.JWT_TOKEN_SECRET,
        '4h'
      );
      return c.json({ jwt: token });
    } catch (error) {
      console.error('Error occurred during anonymous authentication:', error);
      return text(c, 'Error occurred during authentication', 500);
    }
  });

  app.put('/auth/email', allowIfAnyOf('active'), async (c) => {
    const body = await readJsonBody(c);
    if (!body) return text(c, 'Invalid JSON', 400);
    const uuid = typeof body.uuid === 'string' ? body.uuid : '';
    const email = typeof body.email === 'string' ? body.email : '';
    if (!uuid || !email) return text(c, 'Invalid Request Body. uuid and email are required.', 401);

    try {
      const user = extractUser(c);
      if (user.uuid !== uuid) return text(c, 'Unauthorized to update email for this user.', 401);
      const sql = c.get('sql');
      const schema = schemaOf(c.env);
      const existing = await identityDb.selectUserByEmail(sql, schema, email);
      if (existing) return c.json('Email is in use by another user', 409);
      await identityDb.updateEmail(sql, schema, uuid, email);
      await identityDb.updateEmailVerification(sql, schema, uuid, false);
      await sendVerificationEmail(c.env, '', email, user.token);
      return text(c, 'OK');
    } catch (error) {
      console.error('Error updating email: ', error);
      return text(c, 'Error updating email', 500);
    }
  });

  app.put('/auth/password', allowIfAnyOf('active', 'password-reset'), async (c) => {
    const body = await readJsonBody(c);
    if (!body) return text(c, 'Invalid JSON', 400);
    const newPassword = typeof body.newPassword === 'string' ? body.newPassword : '';
    const currentPassword = typeof body.currentPassword === 'string' ? body.currentPassword : '';
    if (!newPassword) return text(c, 'Invalid Request Body. newPassword is required.', 401);

    try {
      const userReq = extractUser(c);
      const userId = UUID_REGEXP.test(userReq.uuid) ? userReq.uuid : canonicalUuid(userReq.uuid);
      const sql = c.get('sql');
      const schema = schemaOf(c.env);
      const user = await identityDb.selectUserByID(sql, schema, userId);
      if (!user) return text(c, 'Invalid: Unable to verify user.', 403);
      if (currentPassword) {
        const storedHash = readStoredBcryptHash(user.password, c.env.ENCRYPT_SECRET);
        if (!storedHash) {
          await sendPasswordResetEmail(c.env, sql, schema, user.email);
          return c.json({ code: PASSWORD_RESET_REQUIRED }, 403);
        }
        if (!(await comparePassword(currentPassword, storedHash))) {
          return text(c, "Unable to verify user's existing password", 403);
        }
      }
      const encryptedPassword = encryptString(await hashPassword(newPassword), c.env.ENCRYPT_SECRET);
      await identityDb.updatePassword(sql, schema, userId, encryptedPassword);
      await sendPasswordChangeConfirmation(c.env, sql, schema, userId);
      return text(c, 'OK');
    } catch (error) {
      console.error('Error updating password: ', error);
      return text(c, 'Error updating password', 500);
    }
  });

  app.get('/auth/email/verify/:token', async (c) => {
    const token = c.req.param('token');
    if (!token) return c.redirect(`${c.env.HOST}/verified?errorCode=INVALID_TOKEN`, 301);
    try {
      const secret = new TextEncoder().encode(c.env.JWT_TOKEN_SECRET);
      const { payload } = await jwtVerify(token, secret, { algorithms: ['HS256'] });
      let uuid = String(payload.sub ?? '');
      if (!UUID_REGEXP.test(uuid)) uuid = canonicalUuid(uuid);
      const sql = c.get('sql');
      const schema = schemaOf(c.env);
      const user = await identityDb.selectUserByID(sql, schema, uuid);
      if (user?.has_verified_email) return c.redirect(`${c.env.HOST}/verified?errorCode=EMAIL_ALREADY_VERIFIED`, 301);
      await identityDb.updateEmailVerification(sql, schema, uuid, true);
      await identityDb.addPermissionIds(sql, schema, uuid, ['active']);
      await identityDb.updateActiveStatus(sql, schema, uuid, true);
      return c.redirect(`${c.env.HOST}/verified?token=${encodeURIComponent(token)}`, 301);
    } catch (error) {
      console.error('Error occurred verifying email: ', error);
      if (error instanceof errors.JOSEError) {
        return c.redirect(`${c.env.HOST}/verified?errorCode=TOKEN_VERIFICATION_FAILED`, 301);
      }
      return text(c, `${c.env.HOST}/verified?errorCode=SERVER_ERROR`, 500);
    }
  });

  app.post('/auth/forgot-password', allowIfAnyOf('anonymous'), async (c) => {
    const body = await readJsonBody(c);
    if (!body) return text(c, 'Invalid JSON', 400);
    const email = typeof body.email === 'string' ? body.email : '';
    if (!email) return text(c, 'Email is required', 400);
    try {
      const user = await identityDb.selectUserByEmail(c.get('sql'), schemaOf(c.env), email);
      if (!user) return text(c, 'Email does not exist', 403);
      await sendPasswordResetEmail(c.env, c.get('sql'), schemaOf(c.env), email);
    } catch (error) {
      console.error('Error occurred sending password reset email: ', error);
      return text(c, 'Error updating email', 500);
    }
    return text(c, 'OK');
  });

  app.post('/auth/resend-email-verification', allowIfAnyOf('anonymous'), async (c) => {
    const user = extractUser(c);
    try {
      const dbUser = await identityDb.selectUserByID(c.get('sql'), schemaOf(c.env), user.uuid);
      if (!dbUser) return text(c, 'Incorrect id provided', 401);
      await sendVerificationEmail(c.env, dbUser.name, dbUser.email, user.token);
      return text(c, 'OK');
    } catch (error) {
      console.error('Error occurred verifying email: ', error);
      return text(c, 'Error occurred verifying email!', 500);
    }
  });

  app.post('/email/contact-us', allowIfAnyOf('anonymous'), async (c) => {
    const body = await readJsonBody(c);
    if (!body) return text(c, 'Invalid JSON', 400);
    try {
      await sendContactUsEmail(
        c.env,
        String(body.name ?? ''),
        String(body.email ?? ''),
        String(body.desc ?? ''),
        String(body.ticketId ?? '')
      );
      return text(c, 'OK');
    } catch (error) {
      console.error('Error occurred sending email: ', error);
      return text(c, 'Error occurred sending email!', 500);
    }
  });
}
