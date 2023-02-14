import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import * as db from './db/queries';
import * as jwt from 'jsonwebtoken';
// import { selectUserByEmail } from './db/queries';
import * as bodyParser from 'body-parser';
import * as settings from './settings';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/content', async (req: Request, res: Response) => {
  const newContent = req.body;

  res.json({
    "data": {
      "id": "abc123"
    }
  });
});

app.get('/content', async (req: Request, res: Response) => {
  const {
    page,
    page_size,
    category,
    type,
    nation,
    creator
  } = req.query;

  res.json({
    "data": [
      {
        "id": "1",
        "title": "Title 1",
        "creator": "Creator 1",
        "url": "/content/1",
        "thumbnailUrl": "images/video_thumbnail.jpg",
        "iconUrl": "images/creator_icon.png",
        "category": "video",
        "type": "video"
      },
      {
        "id": "2",
        "title": "Title 2",
        "creator": "Creator 2",
        "url": "/content/2",
        "thumbnailUrl": "images/video_thumbnail.jpg",
        "iconUrl": "images/creator_icon.png",
        "category": "video",
        "type": "video"
      }
    ]
  });
});

app.get('/content/:contentId', async (req: Request, res: Response) => {
  const { contentId } = req.query;

  res.json({
    "data": {
      "id": contentId,
      "url": "/video.mp4",
      "title": `Video ${contentId}`,
      "createdDate": "07/01/2022",
      "updatedDate": "07/01/2022",
      "description": "Description of content Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dolor sem faucibus auctor quam pretium massa nulla cursus. Vel, a nisl ipsum, nisl. Mauris.",
      "descriptionUrl": "/description.mp3",
      "credits": "Dawn Powell, Camera Operator, Alissa Cat, Public Programs Magnus Ten, Editor",
      "contributors": [
        {
          "id": "1",
          "link": "/profile/1",
          "name": "Museum Of Anthropology",
          "socialUrl": "https: //www.twitter.com",
          "socialHandle": "@Moa",
          "logoUrl": "/images/moa.svg"
        },
        {
          "id": "2",
          "name": "Museum of Vancouver",
          "socialUrl": "https: //www.twitter.com",
          "socialHandle": "@Mov",
          "logoUrl": ""
        },
        {
          "id": "3",
          "name": "Dana Claxton"
        }
      ],
      "tags": [
        "tag 1",
        "tag 2"
      ]
    }
  });
});

app.listen(settings.PORT, async () => {
  console.log(`Listening on port ${settings.PORT}`);
});
