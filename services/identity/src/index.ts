import * as dotenv from 'dotenv';
import * as express from 'express';
import * as cors from 'cors';
// import * as helmet from 'helmet';
import * as db from '../db/queries';
import * as jwt from 'jsonwebtoken';
import {
  comparePassword,
  encryptString,
  decryptString,
  hashPassword
} from './utils';
import { selectUserByEmail } from '../db/queries';
import * as bodyParser from 'body-parser';

dotenv.config();

export const APP_URL: string = process.env.REACT_APP_ORIGIN || '';
export const API_URL: string = process.env.REACT_APP_API_URL || '';

export const DEFAULT_API_VERSION = 'v1';
export const API_BASE_PATH = `/api/${DEFAULT_API_VERSION}`;

const PORT: number = parseInt((process.env.PORT as string) || '8080', 10);

const app = express();

// app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/auth/user', async (req, res) => {
  const {
    name,
    email,
    password,
    permissionIds = [],
    hasAcceptedNewsletter = false,
    hasAcceptedTerms = false
  } = req.body;

  if (!name || !email || !password) {
    return res
      .status(401)
      .send(
        'Invalid Request Body. name, email, and password must be provided.'
      );
  }

  try {
    const hashedPassword = await hashPassword(password);
    const encryptedPassword = encryptString(hashedPassword);

    await db.insertIdentity(
      name,
      email,
      encryptedPassword,
      permissionIds,
      hasAcceptedNewsletter,
      hasAcceptedTerms
    );
    res.status(201).send('OK');
  } catch (e) {
    if (e.message.indexOf('duplicate key') !== -1) {
      res.status(400).send('Email already exists');
    } else {
      console.log(e.message);
      res.status(500).send('Error creating identity');
    }
  }
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(401)
      .send('Invalid Request Body. email, and password must be provided.');
  }

  try {
    const r = await selectUserByEmail(email);
    const user = r.rows[0];

    const decryptedPassword = decryptString(user.password);

    if (await comparePassword(password, decryptedPassword)) {
      const token = jwt.sign(
        {
          uuid: user.uuid,
          permissionIds: user.permission_ids
        },
        process.env.JWT_TOKEN_SECRET
      );
      res.json({
        data: {
          jwt: token
        }
      });
    } else {
      res.status(401).send('Invalid Password.');
    }
  } catch (e) {
    console.log(e.message);
    res.status(500).send('Error occurred during authentication');
  }
});

app.post('/auth/anonymous', (req, res) => {
  const { anonymous } = req.body;

  if (!anonymous && anonymous !== true) {
    return res
      .status(401)
      .send('Invalid Request Body provided for anonymous token.');
  }
  try {
    const token = jwt.sign({ anonymous: true }, process.env.JWT_TOKEN_SECRET);
    res.json({
      data: {
        jwt: token
      }
    });
  } catch (e) {
    console.log(e.message);
    res.status(500).send('Error occurred during authentication');
  }
});

app.put('/auth/email', async (req, res) => {
  const { uuid, email } = req.body;

  if (!uuid || !email) {
    return res
      .status(401)
      .send('Invalid Request Body. uuid and email is required.');
  }

  try {
    await db.updateEmail(uuid as string, email);
    res.send('OK');
  } catch (e) {
    return res.status(500).send('Error updating email');
  }
});

app.put('/auth/password', async (req, res) => {
  const { uuid, password } = req.body;

  if (!uuid || !password) {
    return res
      .status(401)
      .send('Invalid Request Body. uuid and password are required.');
  }

  try {
    await db.updatePassword(uuid as string, password);
    res.send('OK');
  } catch (e) {
    return res.status(500).send('Error updating password');
  }
});

app.get('/auth/verify', async (req, res) => {
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
  } catch (e) {
    console.log(e.message);
    return res.status(500).send('Error occurred verifying email');
  }
  res.send('OK');
});

app.get('/auth/forgot-password', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).send('email is required.');
  }

  try {
    const r = await selectUserByEmail(email as string);
    if (r.rows.length === 1) {
      console.log('triggering password reset email...');
    } else {
      return res.status(403).send('email does not exist');
    }
  } catch (e) {
    return res.status(500).send('Error updating email');
  }

  res.send('OK');
});

app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);
});
