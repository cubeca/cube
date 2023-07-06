import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { validationResult } from 'express-validator';
import * as jwt from 'jsonwebtoken';
import * as db from './db/queries';
import { comparePassword, encryptString, decryptString, hashPassword, validateUserCreateInput } from './utils';
import * as settings from './settings';
import { allowIfAnyOf } from './auth';
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
app.post('/auth/user', validateUserCreateInput, async (req: Request, res: Response) => {
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
    hasAcceptedTerms = false
  } = req.body;

  try {
    const hashedPassword = await hashPassword(password);
    const encryptedPassword = encryptString(hashedPassword);

    // Create Default Profile
    let profileId = '';
    if (organization || website || tag) {
      profileId = await createDefaultProfile(organization, website, tag);
      if (!profileId) {
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
      hasAcceptedNewsletter,
      hasAcceptedTerms
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
      res.status(400).send('Email already exists');
    } else {
      console.error(error);
      res.status(500).send('Error creating identity');
    }
  }
});

/**
 * Log a user in based on supplied username and password.
 */
app.post('/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).send('Invalid request body. Username and password must be provided.');
  }

  try {
    const r = await db.selectUserByEmail(email);

    if (!r) {
      return res.status(403).send('Invalid username or password.');
    }

    const user = r.rows[0];
    const decryptedPassword = decryptString(user.password);
    const isValidPassword = await comparePassword(password, decryptedPassword);
    if (!isValidPassword) {
      return res.status(403).send('Invalid email or password.');
    }

    if (!user.is_active || !user.has_verified_email) {
      return res.status(403).send('User isnt active or verified their email');
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
      profile_id: user.profile_id

    }


    res.json({ jwt: token, user: userReturnObj});
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
  const { uuid, email, token } = req.body;

  if (!uuid || !email || !token) {
    return res.status(401).send('Invalid Request Body. uuid, email, and token are required.');
  }

  try {
    jwt.verify(token, settings.JWT_TOKEN_SECRET, async (err: any, decoded: any) => {
      if (err) {
        return res.status(401).send(err);
      }

      const userId = decoded.sub;
      if (userId !== uuid) {
        return res.status(401).send('Unauthorized to update email for this user.');
      }

      await db.updateEmail(uuid, email);
      await db.updateEmailVerification(uuid, false);
      await sendVerificationEmail('', email, token);
      res.send('OK');
    });
  } catch (error: any) {
    console.error('Error updating email:', error);
    return res.status(500).send('Error updating email');
  }
});

/**
 * Update password for a user.
 */
app.put('/auth/password', async (req: Request, res: Response) => {
  const { uuid, currentPassword, newPassword, token } = req.body;

  if (!uuid || !currentPassword || !newPassword || !token) {
    return res.status(401).send('Invalid Request Body. uuid, password, and token are required.');
  }

  try {
    jwt.verify(token, settings.JWT_TOKEN_SECRET, async (err: any, decoded: any) => {
      if (err) {
        return res.status(401).send(err);
      }

      const userId = decoded.sub;
      if (userId !== uuid) {
        return res.status(401).send('Unauthorized to update password for this user.');
      }

      const r = await db.selectUserByID(uuid);
      if (!r) {
        return res.status(403).send('Invalid unable to verify users existing password.');
      }

      const user = r.rows[0];
      const decryptedPassword = decryptString(user.password);
      const isValidPassword = await comparePassword(currentPassword, decryptedPassword);

      // Proceed with password update
      if (isValidPassword) {
        const hashedPassword = await hashPassword(newPassword);
        const encryptedPassword = encryptString(hashedPassword);

        await db.updatePassword(uuid as string, encryptedPassword);
        await sendPasswordChangeConfirmation(uuid as string);
        res.send('OK');
      } else {
        return res.status(403).send('Unable to verify users existing password');
      }
    });
  } catch (error: any) {
    console.error('Error updating password:', error);
    return res.status(500).send('Error updating password');
  }
});

/**
 * On account creation, confirm the users email via provided link to their inbox.
 */
app.get('/auth/email/verify/:token', async (req: Request, res: Response) => {
  const token = req.params.token as string;

  if (!token) {
    return res.status(401).send('Invalid Request Body. token is required.');
  }

  try {
    jwt.verify(token, settings.JWT_TOKEN_SECRET, async (err: any, decoded: any) => {
      if (err) {
        return res.status(401).send(err);
      }

      const encodedUUID = decoded.sub;
      const encoder = new UuidEncoder('base36');
      const uuid = encoder.decode(encodedUUID);

      const r = await db.selectUserByID(uuid as string);
      if (r.rows.length === 1) {
        await db.updateEmailVerification(uuid as string, true);
        await db.addPermissionIds(uuid as string, ['active']);
        await db.updateActiveStatus(uuid as string, true);
      } else {
        return res.status(401).send('Incorrect id provided');
      }

      const redirectUrl = `${process.env.HOST}/verify/?token=` + encodeURIComponent(token);
      res.redirect(301, redirectUrl);
    });
  } catch (error: any) {
    console.error('Error occurred verifying email:', error);
    return res.status(500).send('Error occurred verifying email!');
  }
});

/**
 * Trigger password reset email to users who are locked out.
 */
app.post('/auth/forgot-password', async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send('email is required.');
  }

  try {
    const r = await db.selectUserByEmail(email as string);
    if (r.rows.length === 1) {
      await sendPasswordResetEmail(email);
    } else {
      return res.status(403).send('email does not exist');
    }
  } catch (error: any) {
    console.error('Error occurred sending password reset email:', error);
    return res.status(500).send('Error updating email');
  }

  res.send('OK');
});

app.get('/', async (req: Request, res: Response) => {
  return res.status(200).send('Service is running');
});

app.listen(settings.PORT, async () => {
  console.log(`Listening on port ${settings.PORT}`);
});
