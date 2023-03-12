import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import * as db from './db/queries';
import * as jwt from 'jsonwebtoken';
import * as bodyParser from 'body-parser';
import * as settings from './settings';
import { allowIfAnyOf, extractUser } from './auth';

const PERMISSION_IDS_ALLOWED_ON_SIGNUP = ['active'];

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/profiles', async (req: Request, res: Response) => {
  const { organization, website, tag } = req.body;

  if (!organization || !website || !tag) {
    return res.status(401).send('Invalid Request Body: organization, website, and tag must be provided.');
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
    const r = await db.insertProfile(organization, website, tag);

    if (r.rows.length !== 1) {
      // TODO TBD Is this an impossible case?
      return res.status(500).send('Error creating profile');
    }

    const profile = r.rows[0];
    res.status(201).json({ id: profile.id });
  } catch (e: any) {
    if (e.message.indexOf('duplicate key') !== -1) {
      res.status(400).send('Organization with provided details already exists');
    } else {
      console.log(e.message);
      res.status(500).send('Error creating profile');
    }
  }
});

app.get('/profiles/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    res.status(404).send('Profile Id not found.');
    return;
  }

  try {
    const r = await db.selectProfileByID(id);
    const profile = r.rows[0];

    if (!profile) {
      res.status(404).send('Profile Id not found');
      return;
    }
    res.status(200).json({ ...profile });
  } catch (e: any) {
    console.log(e.message);
    res.status(404).send('Organization does not exist');
  }
});

app.listen(settings.PORT, async () => {
  console.log(`Listening on port ${settings.PORT}`);
});
