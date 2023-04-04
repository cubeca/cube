
import axios from 'axios';
import jsonwebtoken from 'jsonwebtoken';

import * as settings from './settings';
import { inspect, inspectAxiosResponse, inspectAxiosError } from './utils';

const API_URL = `http://${settings.MICROSERVICE}:${settings.PORT}`;

const UUID_REGEXP = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const TIMESTAMP_REGEXP = /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3,6}Z$/;

const NIL_UUID = '00000000-0000-0000-0000-000000000000';

const contentApi = axios.create({
  baseURL: API_URL,
  timeout: 60 * 1000,

  // Do not throw errors for non-2xx responses, that makes testing easier.
  validateStatus: null
});

const getAuthReqOpts = (...permissions: string[]) => {
  const jwt = jsonwebtoken.sign(
    {
      iss: 'CUBE',
      sub: NIL_UUID,
      aud: permissions
    },
    settings.JWT_TOKEN_SECRET
  );

  return getReqOptsWithJwt(jwt);
};

const getReqOptsWithJwt = (jwt: string) => ({ headers: { Authorization: `Bearer ${jwt}` } });

test('creates content piece', async () => {
  const requestBody = {
    "profileId": "4863f84d-7ca5-4a00-bd80-b0c87e005711",
    "title": "Ash Test",
    "mediaFileId": "360cfe42-0db2-47d1-926b-9e627a22dd5c",
    "description": "This is a test by Ashlee of one of her Youtube videos",
    "tags": [
      "exercises, art, rest, BC "
    ],
    "type": "video",
    "contributors": [
      null
    ],
    "collaborators": [
      "moa"
    ],
    "coverImageFileId": "e0821a87-caef-472f-affd-a657692850ab",
    "coverImageText": "Woman laying on table"
  };

  const createContentResponse = await contentApi.post(
    '/content',
    requestBody,
    getAuthReqOpts('contentEditor')
  );
  const { status: createContentStatus, data: createContentData } = createContentResponse;
  if (201 !== createContentStatus) {
    inspectAxiosResponse(createContentResponse);
  }

  expect(createContentStatus).toEqual(201);

  expect(createContentData).toMatchObject(
    expect.objectContaining({
      id: expect.stringMatching(UUID_REGEXP),
      createdAt: expect.stringMatching(TIMESTAMP_REGEXP),
      updatedAt: expect.stringMatching(TIMESTAMP_REGEXP),
      ...requestBody
    })
  );
});

test('lists mock content pieces', async () => {

  const response = await contentApi.get('/content');
  const { status, data } = response;
  if (200 !== status) {
    inspectAxiosResponse(response);
  }

  expect(status).toEqual(200);

  expect(data).toMatchObject({
    data: expect.arrayContaining([
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
    ])
  });
});

test('gets mocked content piece details', async () => {

  const contentId = '7110767b-8d14-45bc-8ff1-9286fa06aae1';
  const response = await contentApi.get(`/content/${contentId}`);
  const { status, data } = response;
  if (200 !== status) {
    inspectAxiosResponse(response);
  }

  expect(status).toEqual(200);

  expect(data).toMatchObject({
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
