import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import he from 'he';
import { validationResult } from 'express-validator';
import * as jwt from 'jsonwebtoken';
import * as db from './db/queries';
import {
  comparePassword,
  encryptString,
  decryptString,
  hashPassword,
  validateUserCreateInput,
  filterHeadersToForward,
  UUID_REGEXP
} from './utils';
import * as settings from './settings';
import { allowIfAnyOf, extractUser } from './auth';
import { createDefaultProfile } from './profile';
import { sendVerificationEmail, sendPasswordChangeConfirmation, sendPasswordResetEmail } from './email';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import UuidEncoder from 'uuid-encoder';

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Create a user based on provided attributes.  If an organization, website or tag is passed
 * also create an associated profile for the user.
 */
app.post('/auth/user', allowIfAnyOf('anonymous'), validateUserCreateInput, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    name,
    email,
    organization,
    website,
    tag,
    password,
    hasAcceptedNewsletter = false,
    hasAcceptedTerms = false,
    isOver18
  } = req.body;

  try {
    const hashedPassword = await hashPassword(password);
    const encryptedPassword = encryptString(hashedPassword);
    const permissionIds = ['anonymous'];

    // Create Default Profile
    let profileId = '';
    if (organization || website || tag) {
      const authHeader = filterHeadersToForward(req, 'authorization');
      profileId = await createDefaultProfile(authHeader, organization, he.decode(website), tag);
      permissionIds.push('contentEditor');
      if (!profileId) {
        console.error(
          'Error creating profile for user. Organization name, website or tag already exist',
          organization,
          website,
          tag
        );
        return res
          .status(400)
          .send('Error creating profile for user. Organization name, website, or tag already exists');
      }
    }

    // Insert User Identity
    const r = await db.insertIdentity(
      name,
      email,
      profileId,
      encryptedPassword,
      permissionIds,
      hasAcceptedNewsletter,
      hasAcceptedTerms,
      isOver18
    );

    const user = r.rows[0];
    const encoder = new UuidEncoder('base36');
    const encodedUuid = encoder.encode(user.id);

    const token = jwt.sign({ iss: 'CUBE', sub: encodedUuid, aud: ['unverified'] }, settings.JWT_TOKEN_SECRET, {
      expiresIn: '7d'
    });

    await sendVerificationEmail(name, email, token);

    res.status(201).json({ id: user.id, jwt: token });
  } catch (error: any) {
    if (error.message.includes('duplicate key')) {
      console.error('Email already exists', error);
      res.status(400).send('Email already exists');
    } else {
      console.error('Error creating identity', error);
      res.status(500).send('Error creating identity');
    }
  }
});

/**
 * Log a user in based on supplied username and password.
 */
app.post('/auth/login', allowIfAnyOf('anonymous'), async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).send('Invalid request body. Username and password must be provided.');
  }

  try {
    const r = await db.selectUserByEmail(email);
    if (!r.rows[0]) {
      return res.status(403).send('Invalid email or password');
    }

    const user = r.rows[0];
    const decryptedPassword = decryptString(user.password);
    const isValidPassword = await comparePassword(password, decryptedPassword);
    if (!isValidPassword) {
      return res.status(403).send('Invalid email or password');
    }

    const token = jwt.sign(
      {
        iss: 'CUBE',
        sub: user.id,
        aud: user.permission_ids
      },
      settings.JWT_TOKEN_SECRET,
      { expiresIn: '3d' }
    );

    const userReturnObj = {
      uuid: user.id,
      name: user.name,
      email: user.email,
      permission_ids: user.permission_ids,
      is_active: user.is_active,
      has_verified_email: user.has_verified_email,
      has_accepted_terms: user.has_accepted_terms,
      profile_id: user.profile_id,
      isOver18: user.is_over_18
    };

    res.json({ jwt: token, user: userReturnObj });
  } catch (error: any) {
    console.error('Error occurred during authentication:', error);
    res.status(500).send('Error occurred during authentication');
  }
});

/**
 * Allow anonymous users to obtain a temporary authentication token
 */
app.post('/auth/anonymous', async (req: Request, res: Response) => {
  try {
    const token = jwt.sign(
      {
        iss: 'CUBE',
        sub: '00000000-0000-0000-0000-000000000000',
        aud: ['anonymous']
      },
      settings.JWT_TOKEN_SECRET,
      { expiresIn: '4h' }
    );
    res.json({ jwt: token });
  } catch (error: any) {
    console.error('Error occurred during anonymous authentication:', error);
    res.status(500).send('Error occurred during authentication');
  }
});

/**
 * Update an email for currently authenticated users.
 */
app.put('/auth/email', allowIfAnyOf('active'), async (req: Request, res: Response) => {
  const { uuid, email } = req.body;

  if (!uuid || !email) {
    return res.status(401).send('Invalid Request Body. uuid and email are required.');
  }

  try {
    const user = extractUser(req);
    if (user.uuid !== uuid) {
      return res.status(401).send('Unauthorized to update email for this user.');
    }

    const existingUser = await db.selectUserByEmail(email);
    if (existingUser.rows[0]) {
      return res.status(409).json('Email is in use by another user');
    }

    await db.updateEmail(uuid, email);
    await db.updateEmailVerification(uuid, false);
    await sendVerificationEmail('', email, user.token);
    res.send('OK');
  } catch (error: any) {
    console.error('Error updating email: ', error);
    return res.status(500).send('Error updating email');
  }
});

/**
 * Update password for a user.
 */
app.put('/auth/password', allowIfAnyOf('active', 'password-reset'), async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  if (!newPassword) {
    return res.status(401).send('Invalid Request Body. newPassword is required.');
  }

  try {
    const userReq = extractUser(req);
    if (!UUID_REGEXP.test(userReq.uuid)) {
      const encoder = new UuidEncoder('base36');
      userReq.uuid = encoder.decode(userReq.uuid);
    }

    const r = await db.selectUserByID(userReq.uuid);
    if (!r) {
      return res.status(403).send('Invalid: Unable to verify user.');
    }

    const user = r.rows[0];
    if (currentPassword) {
      const decryptedPassword = decryptString(user.password);
      const isValidPassword = await comparePassword(currentPassword, decryptedPassword);
      if (!isValidPassword) {
        return res.status(403).send("Unable to verify user's existing password");
      }
    }

    // If we got to this point, either the user has provided the correct currentPassword,
    // or they're using a valid auth token without the currentPassword.
    const hashedPassword = await hashPassword(newPassword);
    const encryptedPassword = encryptString(hashedPassword);

    await db.updatePassword(userReq.uuid as string, encryptedPassword);
    await sendPasswordChangeConfirmation(userReq.uuid as string);
    res.send('OK');
  } catch (error: any) {
    console.error('Error updating password: ', error);
    return res.status(500).send('Error updating password');
  }
});

/**
 * On account creation, confirm the users email via provided link to their inbox.
 */
app.get('/auth/email/verify/:token', async (req: Request, res: Response) => {
  const token = req.params.token as string;

  if (!token) {
    const redirectUrl = `${process.env.HOST}/verified?errorCode=INVALID_TOKEN`;
    return res.status(301).send(redirectUrl);
  }

  try {
    jwt.verify(token, settings.JWT_TOKEN_SECRET, async (err: any, decoded: any) => {
      if (err) {
        const redirectUrl = `${process.env.HOST}/verified?errorCode=TOKEN_VERIFICATION_FAILED`;
        return res.status(301).send(redirectUrl);
      }

      let uuid = decoded.sub;
      if (!UUID_REGEXP.test(uuid)) {
        const encoder = new UuidEncoder('base36');
        uuid = encoder.decode(uuid);
      }

      const user = await db.selectUserByID(uuid as string);
      if (user.rows.length !== 1) {
        const redirectUrl = `${process.env.HOST}/verified?errorCode=INCORRECT_ID`;
        return res.status(301).send(redirectUrl);
      }

      const { has_verified_email } = user.rows[0];
      if (has_verified_email) {
        const redirectUrl = `${process.env.HOST}/verified?errorCode=EMAIL_ALREADY_VERIFIED`;
        return res.status(301).send(redirectUrl);
      }

      await db.updateEmailVerification(uuid as string, true);
      await db.addPermissionIds(uuid as string, ['active']);
      await db.updateActiveStatus(uuid as string, true);

      const redirectUrl = `${process.env.HOST}/verified?token=` + encodeURIComponent(token);
      return res.status(301).send(redirectUrl);
    });
  } catch (error: any) {
    console.error('Error occurred verifying email: ', error);
    const redirectUrl = `${process.env.HOST}/verified?errorCode=SERVER_ERROR`;
    return res.status(500).send(redirectUrl);
  }
});

/**
 * Trigger password reset email to users who are locked out.
 */
app.post('/auth/forgot-password', allowIfAnyOf('anonymous'), async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send('Email is required');
  }

  try {
    const r = await db.selectUserByEmail(email as string);
    if (r.rows.length === 1) {
      await sendPasswordResetEmail(email);
    } else {
      return res.status(403).send('Email does not exist');
    }
  } catch (error: any) {
    console.error('Error occurred sending password reset email: ', error);
    return res.status(500).send('Error updating email');
  }

  res.send('OK');
});

/**
 * Trigger email verification if original has expired or didn't arrive.
 */
app.post('/auth/resend-email-verification', allowIfAnyOf('anonymous'), async (req: Request, res: Response) => {
  const user = extractUser(req);

  try {
    const r = await db.selectUserByID(user.uuid);
    if (r.rows.length === 1) {
      const name = r.rows[0].name;
      const email = r.rows[0].email;
      await sendVerificationEmail(name, email, user.token);
    } else {
      return res.status(401).send('Incorrect id provided');
    }

    res.send('OK');
  } catch (error: any) {
    console.error('Error occurred verifying email: ', error);
    return res.status(500).send('Error occurred verifying email!');
  }
});

app.get('/', async (req: Request, res: Response) => {
  return res.status(200).send('Service is running');
});

app.listen(settings.PORT, async () => {
  console.log(`Listening on port ${settings.PORT}`);
});
