import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import * as db from './db/queries';
import * as jwt from 'jsonwebtoken';
import { comparePassword, encryptString, decryptString, hashPassword } from './utils';
import * as bodyParser from 'body-parser';
import * as settings from './settings';
import { allowIfAnyOf, extractUser } from './auth';
import { createDefaultProfile } from './profile';

const PERMISSION_IDS_ALLOWED_ON_SIGNUP = ['active'];

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const sendVerificationEmail = async (email: string, userId: string) => {
  const token = jwt.sign(
    {
      iss: 'CUBE',
      sub: userId,
      aud: ['unverified']
    },
    settings.JWT_TOKEN_SECRET
  );

  // TODO implement me
  console.log(`TODO implement me: Send verification email for ${userId} to ${email}`);
};

app.post('/auth/user', async (req: Request, res: Response) => {
  const {
    name,
    email,
    organization,
    website,
    tag,
    password,
    permissionIds = [],
    hasAcceptedNewsletter = false,
    hasAcceptedTerms = false
  } = req.body;

  if (!name || !email || !password || !organization || !website || !tag) {
    return res
      .status(401)
      .send('Invalid Request Body: name, email, organization, website, tag, and password must be provided.');
  }

  // if (
  //   !extractUser(req).permissionIds.includes('userAdmin') &&
  //   permissionIds.some((p: string) => !PERMISSION_IDS_ALLOWED_ON_SIGNUP.includes(p))
  // ) {
  //   return res
  //     .status(403)
  //     .send(
  //       `Invalid Request Body. Only with "userAdmin" JWT claim can the created user have permissionIds other than "${PERMISSION_IDS_ALLOWED_ON_SIGNUP.join(
  //         '", "'
  //       )}".`
  //     );
  // }

  try {
    const hashedPassword = await hashPassword(password);
    const encryptedPassword = encryptString(hashedPassword);

    const profileId = await createDefaultProfile(organization, website, tag);

    if (!profileId) {
      return res.status(400).send('Error creating profile for user. Organization name, website or tag already exists');
    }

    const r = await db.insertIdentity(
      name,
      email,
      profileId,
      encryptedPassword,
      permissionIds,
      hasAcceptedNewsletter,
      hasAcceptedTerms
    );

    if (r.rows.length !== 1) {
      // TODO TBD Is this an impossible case?
      // If this fails we would also have to delete the profile that was created for this identity
      return res.status(500).send('Error creating identity');
    }

    const user = r.rows[0];
    await sendVerificationEmail(email, user.id);
    res.status(201).json({ id: user.id });
  } catch (e: any) {
    if (e.message.indexOf('duplicate key') !== -1) {
      res.status(400).send('Email already exists');
    } else {
      console.log(e.message);
      res.status(500).send('Error creating identity');
    }
  }
});

app.post('/auth/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(401).send('Invalid Request Body. username and password must be provided.');
  }

  try {
    const r = await db.selectUserByEmail(username);

    if (r.rows.length === 0) {
      return res.status(403).send('Invalid username or password.');
    }

    const user = r.rows[0];

    const decryptedPassword = decryptString(user.password);

    if (await comparePassword(password, decryptedPassword)) {
      const token = jwt.sign(
        {
          iss: 'CUBE',
          sub: user.id,
          aud: user.permission_ids
        },
        settings.JWT_TOKEN_SECRET
      );
      res.json({ jwt: token, profileId: user.profile_id });
    } else {
      res.status(403).send('Invalid username or password.');
    }
  } catch (e: any) {
    console.log(e.message);
    res.status(500).send('Error occurred during authentication');
  }
});

app.post('/auth/anonymous', async (req: Request, res: Response) => {
  // const { anonymous } = req.body;
  //
  // if (!anonymous && anonymous !== true) {
  //   return res.status(401).send('Invalid Request Body provided for anonymous token.');
  // }
  try {
    const token = jwt.sign(
      {
        iss: 'CUBE',
        sub: '00000000-0000-0000-0000-000000000000',
        aud: ['anonymous']
      },
      settings.JWT_TOKEN_SECRET
    );
    res.json({ jwt: token });
  } catch (e: any) {
    console.log(e.message);
    res.status(500).send('Error occurred during authentication');
  }
});

app.put('/auth/email', allowIfAnyOf('active'), async (req: Request, res: Response) => {
  const { uuid, email } = req.body;

  if (!uuid || !email) {
    return res.status(401).send('Invalid Request Body. uuid and email is required.');
  }

  try {
    await db.updateEmail(uuid as string, email);
    await sendVerificationEmail(email, uuid);
    res.send('OK');
  } catch (e: any) {
    return res.status(500).send('Error updating email');
  }
});

app.put('/auth/password', allowIfAnyOf('active'), async (req: Request, res: Response) => {
  const { uuid, password } = req.body;

  if (!uuid || !password) {
    return res.status(401).send('Invalid Request Body. uuid and password are required.');
  }

  try {
    const hashedPassword = await hashPassword(password);
    const encryptedPassword = encryptString(hashedPassword);
    await db.updatePassword(uuid as string, encryptedPassword);
    res.send('OK');
  } catch (e: any) {
    return res.status(500).send('Error updating password');
  }
});

app.get('/auth/verify', allowIfAnyOf('unverified'), async (req: Request, res: Response) => {
  const { uuid } = req.query;

  if (!uuid) {
    return res.status(401).send('Invalid Request Body. id is required.');
  }

  try {
    const r = await db.selectUserByID(uuid as string);

    if (r.rows.length === 1) {
      await db.updateEmailVerification(uuid as string, true);
    } else {
      return res.status(401).send('Incorrect id provided');
    }
  } catch (e: any) {
    console.log(e.message);
    return res.status(500).send('Error occurred verifying email');
  }
  res.send('OK');
});

app.get('/auth/forgot-password', async (req: Request, res: Response) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).send('email is required.');
  }

  try {
    const r = await db.selectUserByEmail(email as string);
    if (r.rows.length === 1) {
      console.log('triggering password reset email...');
    } else {
      return res.status(403).send('email does not exist');
    }
  } catch (e: any) {
    return res.status(500).send('Error updating email');
  }

  res.send('OK');
});

app.listen(settings.PORT, async () => {
  console.log(`Listening on port ${settings.PORT}`);
});
