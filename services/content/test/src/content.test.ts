
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

test('creates, retrieves and lists content piece', async () => {
  const profileId = "4863f84d-7ca5-4a00-bd80-b0c87e005711";
  const requestBody = {
    profileId,
    "title": "Ash Test",
    "mediaFileId": "360cfe42-0db2-47d1-926b-9e627a22dd5c",
    "description": "This is a test by Ashlee of one of her Youtube videos",
    "tags": [
      "exercises", "art", "rest", "BC", "still a string?"
    ],
    "type": "video",
    "contributors": [
      "still a string?"
    ],
    "collaborators": [
      "still a string?"
    ],
    "coverImageFileId": "e0821a87-caef-472f-affd-a657692850ab",
    "subtitlesFileId": "213961d0-6804-4b4a-8164-961b7208b8c0",
    "transcriptFileId": "5e090213-b892-478a-901b-5f0317937fc6",
    "coverImageText": "Someone laying on table"
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

  const contentId = createContentData.id;
  const retrieveContentResponse = await contentApi.get(`/content/${contentId}`);
  const { status: retrieveContentStatus, data: retrieveContentData } = retrieveContentResponse;
  if (200 !== retrieveContentStatus) {
    inspectAxiosResponse(retrieveContentResponse);
  }

  expect(retrieveContentStatus).toEqual(200);

  expect(retrieveContentData).toMatchObject(
    expect.objectContaining({
      id: contentId,
      createdAt: createContentData.createdAt,
      updatedAt: createContentData.updatedAt,
      ...requestBody
    })
  );

  const listContentResponse = await contentApi.get('/content', {
    params: {
      offset: 0,
      limit: 10,
      profileId,
    },
  });
  const { status: listContentStatus, data: listContentData } = listContentResponse;
  if (200 !== listContentStatus) {
    inspectAxiosResponse(listContentResponse);
  }

  expect(listContentStatus).toEqual(200);

  expect(listContentData).toMatchObject(expect.objectContaining({
    meta: {
      offset: 0,
      limit: 10,
    },
    data: [
      {
        id: contentId,
        createdAt: createContentData.createdAt,
        updatedAt: createContentData.updatedAt,
        ...requestBody
      }
    ]
  }));
});
