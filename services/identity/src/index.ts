import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import * as db from './db/queries';
import * as jwt from 'jsonwebtoken';
import { comparePassword, encryptString, decryptString, hashPassword } from './utils';
import * as settings from './settings';
import { allowIfAnyOf } from './auth';
import { createDefaultProfile } from './profile';
import Brevo from '@getbrevo/brevo';
import UuidEncoder from 'uuid-encoder';

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sendVerificationEmail = async (name: string, email: string, uuid: string) => {
  const encoder = new UuidEncoder('base36');
  const encodedUuid = encoder.encode(uuid);

  const token = jwt.sign(
    {
      iss: 'CUBE',
      sub: encodedUuid,
      aud: []
    },
    settings.JWT_TOKEN_SECRET
  );

  const defaultClient = Brevo.ApiClient.instance;
  const apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = process.env.BREVO_API_KEY;

  const apiInstance = new Brevo.TransactionalEmailsApi();
  const sendSmtpEmail = new Brevo.SendSmtpEmail();
  sendSmtpEmail.sender = {
    name: 'CubeCommons Email Verification',
    email: 'donotreply@cubecommons.ca'
  };

  sendSmtpEmail.to = [{ name: name, email: email }];
  sendSmtpEmail.templateId = 2;
  sendSmtpEmail.params = {
    NAME: `${name}`,
    EMAIL_VERIFICATION_URL: `${process.env.HOST}:${process.env.PORT}/auth/verify/${token}`
  };

  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data) {
      console.log('API called successfully. Returned data: ' + JSON.stringify(data));
    },
    function (error) {
      throw error;
    }
  );
};

app.post('/auth/user', async (req: Request, res: Response) => {
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
  if (!name || !email || !password) {
    return res.status(401).send('Invalid Request Body: name, email and password must be provided at minimum.');
  }
  const hashedPassword = await hashPassword(password);
  const encryptedPassword = encryptString(hashedPassword);

  let profileId = '';
  if (organization || website || tag) {
    profileId = await createDefaultProfile(organization, website, tag);
    if (!profileId) {
      return res.status(400).send('Error creating profile for user. Organization name, website or tag already exists');
    }
  }
  try {
    const r = await db.insertIdentity(
      name,
      email,
      profileId,
      encryptedPassword,
      hasAcceptedNewsletter,
      hasAcceptedTerms
    );
    const user = r.rows[0];
    await sendVerificationEmail(name, email, user.id);
    res.status(201).json({ id: user.id });
  } catch (e: any) {
    if (e.message.indexOf('duplicate key') !== -1) {
      res.status(400).send('Email already exists');
    } else {
      console.log(e);
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
    res.status(500).send('Error occurred during authentication');
  }
});

app.post('/auth/anonymous', async (req: Request, res: Response) => {
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
    await db.updateActiveStatus(uuid as string, "false")
    await sendVerificationEmail('', email, uuid);
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

app.get('/auth/verify/:token', async (req: Request, res: Response) => {
  const token = req.params.token as string;

  if (!token) {
    return res.status(401).send('Invalid Request Body. token is required.');
  }

  try {
    const decoded = jwt.verify(token, settings.JWT_TOKEN_SECRET);
    const encodedUUID = decoded.sub;

    const encoder = new UuidEncoder('base36');
    const uuid = encoder.decode(encodedUUID);

    const r = await db.selectUserByID(uuid as string);

    if (r.rows.length === 1) {
      await db.updateEmailVerification(uuid as string, true);
      await db.addPermissionIds(uuid as string, ['active'])
      await db.updateActiveStatus(uuid as string, "true");
    } else {
      return res.status(401).send('Incorrect id provided');
    }
  } catch (err) {
    return res.status(500).send('Error occurred verifying email!');
  }

  res.send('OK');
});

app.get('/auth/forgot-password', allowIfAnyOf('active'), async (req: Request, res: Response) => {
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

app.get('/', async (req: Request, res: Response) => {
  return res.status(200).send('Service is running');
});

app.listen(settings.PORT, async () => {
  console.log(`Listening on port ${settings.PORT}`);
});
