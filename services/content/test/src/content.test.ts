import axios from 'axios';
import jsonwebtoken from 'jsonwebtoken';
import * as settings from './settings';

const CONTENT_API_URL = `http://${settings.CONTENT_MICROSERVICE}:${settings.CONTENT_PORT}`;
const IDENTITY_API_URL = `http://${settings.IDENTITY_MICROSERVICE}:${settings.IDENTITY_PORT}`;
const UUID_REGEXP = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const TIMESTAMP_REGEXP = /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3,6}Z$/;
const NIL_UUID = '00000000-0000-0000-0000-000000000000';

const contentApi = axios.create({
  baseURL: CONTENT_API_URL,
  timeout: 60 * 10000,

  // Do not throw errors for non-2xx responses, that makes testing easier.
  validateStatus: null
});

const identityApi = axios.create({
  baseURL: IDENTITY_API_URL,
  timeout: 60 * 10000,

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
    'secret'
  );

  return getReqOptsWithJwt(jwt);
};

const createProfileUser = async () => {
  const requestBody = {
    name: 'Real Name',
    email: 'unique@email.com',
    password: 'super-secret',
    hasAcceptedNewsletter: false,
    hasAcceptedTerms: false,
    organization: '1org-1',
    website: 'w1eb-1',
    tag: 't1ag-1'
  };

  const { status, data } = await identityApi.post('/auth/user', requestBody, getAuthReqOpts('anonymous'));
  return { status, data };
};

const getReqOptsWithJwt = (jwt: string) => ({ headers: { Authorization: `Bearer ${jwt}` } });
const contentIdList: string[] = [];

describe('content test suite', () => {
  beforeAll(async () => {
    const { status, data } = await createProfileUser();
    console.log(data);
  });

  test('sanity test service up', async () => {
    const resp = await contentApi.get('/');
    expect(resp.status).toEqual(200);
  });

  test('creates a content piece', async () => {
    const requestBody = {
      profileId: '4863f84d-7ca5-4a00-bd80-b0c87e005711',
      title: 'Create Content Test',
      mediaFileId: '360cfe42-0db2-47d1-926b-9e627a22dd5c',
      description: 'This is a test',
      tags: ['exercises', 'art', 'rest', 'BC', 'still a string?'],
      type: 'video',
      contributors: ['still a string?'],
      collaborators: ['still a string?'],
      coverImageFileId: 'e0821a87-caef-472f-affd-a657692850ab',
      subtitlesFileId: '213961d0-6804-4b4a-8164-961b7208b8c0',
      transcriptFileId: '5e090213-b892-478a-901b-5f0317937fc6',
      coverImageText: 'Someone laying on table'
    };

    const createContentResponse = await contentApi.post('/content', requestBody, getAuthReqOpts('contentEditor'));
    const { status: createContentStatus, data: createContentData } = createContentResponse;

    expect(createContentStatus).toEqual(201);
    expect(createContentData).toMatchObject(
      expect.objectContaining({
        id: expect.stringMatching(UUID_REGEXP),
        createdAt: expect.stringMatching(TIMESTAMP_REGEXP),
        updatedAt: expect.stringMatching(TIMESTAMP_REGEXP),
        ...requestBody
      })
    );

    contentIdList.push(createContentData.id);
  });

  // test('create and retrieve a content piece', async () => {
  //   const profileId = '4863f84d-7ca5-4a00-bd80-b0c87e005712';
  //   const requestBody = {
  //     profileId,
  //     title: 'Retrieve Test',
  //     mediaFileId: '360cfe42-0db2-47d1-926b-9e627a22dd52',
  //     description: 'This is a test',
  //     tags: ['exercises', 'art', 'rest', 'BC', 'still a string?'],
  //     type: 'video',
  //     contributors: ['still a string?'],
  //     collaborators: ['still a string?'],
  //     coverImageFileId: 'e0821a87-caef-472f-affd-a657692850ab',
  //     subtitlesFileId: '213961d0-6804-4b4a-8164-961b7208b8c0',
  //     transcriptFileId: '5e090213-b892-478a-901b-5f0317937fc6',
  //     coverImageText: 'Someone saying something'
  //   };

  //   const createContentResponse = await contentApi.post('/content', requestBody, getAuthReqOpts('contentEditor'));
  //   const { status: createContentStatus, data: createContentData } = createContentResponse;
  //   expect(createContentStatus).toEqual(201);

  //   const contentId = createContentData.id;
  //   const retrieveContentResponse = await contentApi.get(`/content/${contentId}`);
  //   const { status: retrieveContentStatus, data: retrieveContentData } = retrieveContentResponse;

  //   expect(retrieveContentStatus).toEqual(200);
  //   expect(retrieveContentData).toMatchObject(
  //     expect.objectContaining({
  //       id: contentId,
  //       createdAt: createContentData.createdAt,
  //       updatedAt: createContentData.updatedAt,
  //       ...requestBody
  //     })
  //   );

  //   const listContentResponse = await contentApi.get('/content', {
  //     params: {
  //       offset: 0,
  //       limit: 10,
  //       profileId
  //     }
  //   });

  //   const { status: listContentStatus, data: listContentData } = listContentResponse;

  //   expect(listContentStatus).toEqual(200);
  //   expect(listContentData).toMatchObject(
  //     expect.objectContaining({
  //       meta: {
  //         offset: 0,
  //         limit: 10,
  //         filters: {}
  //       },
  //       data: [
  //         {
  //           id: contentId,
  //           createdAt: createContentData.createdAt,
  //           updatedAt: createContentData.updatedAt,
  //           ...requestBody
  //         }
  //       ]
  //     })
  //   );

  //   contentIdList.push(createContentData.id);
  // });

  // test('create, update and retrieve a content piece', async () => {
  //   const requestBody = {
  //     profileId: '4863f84d-7ca5-4a00-bd80-b0c87e005713',
  //     title: 'Update Test',
  //     mediaFileId: '360cfe42-0db2-47d1-926b-9e627a22dd52',
  //     description: 'This is a test',
  //     tags: ['exercises', 'art', 'rest', 'BC', 'still a string?'],
  //     type: 'video',
  //     contributors: ['still a string?'],
  //     collaborators: ['still a string?'],
  //     coverImageFileId: 'e0821a87-caef-472f-affd-a657692850ab',
  //     subtitlesFileId: '213961d0-6804-4b4a-8164-961b7208b8c0',
  //     transcriptFileId: '5e090213-b892-478a-901b-5f0317937fc6',
  //     coverImageText: 'Someone saying something'
  //   };

  //   const createContentResponse = await contentApi.post('/content', requestBody, getAuthReqOpts('contentEditor'));
  //   const { status: createContentStatus, data: createContentData } = createContentResponse;
  //   expect(createContentStatus).toEqual(201);

  //   const contentId = createContentData.id;
  //   const updateRequestBody = {
  //     profileId: '4863f84d-7ca5-4a00-bd80-b0c87e005713',
  //     title: 'Updated Test Content Successfully!',
  //     mediaFileId: '360cfe42-0db2-47d1-926b-9e627a22dd52',
  //     description: 'This is a test',
  //     tags: ['exercises', 'art', 'rest', 'BC', 'still a string?'],
  //     type: 'video',
  //     contributors: ['still a string?'],
  //     collaborators: ['still a string?'],
  //     coverImageFileId: 'e0821a87-caef-472f-affd-a657692850ab',
  //     subtitlesFileId: '213961d0-6804-4b4a-8164-961b7208b8c0',
  //     transcriptFileId: '5e090213-b892-478a-901b-5f0317937fc6',
  //     coverImageText: 'Someone saying something'
  //   };

  //   const updateContentResponse = await contentApi.post(
  //     `/content/${contentId}`,
  //     updateRequestBody,
  //     getAuthReqOpts('contentEditor')
  //   );
  //   const { status: updateContentStatus } = updateContentResponse;
  //   expect(updateContentStatus).toEqual(201);

  //   const retrieveContentResponse = await contentApi.get(`/content/${contentId}`);
  //   const { status: retrieveContentStatus, data: retrieveContentData } = retrieveContentResponse;

  //   expect(retrieveContentStatus).toEqual(200);
  //   expect(retrieveContentData).toMatchObject(
  //     expect.objectContaining({
  //       id: contentId,
  //       createdAt: createContentData.createdAt,
  //       updatedAt: createContentData.updatedAt,
  //       ...updateRequestBody
  //     })
  //   );

  //   contentIdList.push(retrieveContentData.id);
  // });

  // test('retrieve content by search filters', async () => {
  //   const profileId = '4863f84d-7ca5-4a00-bd80-b0c87e005713';
  //   const filters = { type: 'video', description: 'this is', tags: ['art', 'rest'] };
  //   const encodedFilters = encodeURIComponent(JSON.stringify(filters));

  //   const getContentResponse = await contentApi.get(
  //     `/content/?profileId=${profileId}&limit=5&filters=${encodedFilters}`
  //   );
  //   const { status: getContentStatus, data: getContentData } = getContentResponse;

  //   expect(getContentStatus).toEqual(200);
  //   expect(getContentData.data[0]).toHaveProperty('profileId');
  //   expect(getContentData.data[0]).toHaveProperty('type', 'video');
  //   expect(getContentData.data[0]).toHaveProperty('description', 'This is a test');
  //   expect(getContentData.data[0]).toHaveProperty('tags', ['exercises', 'art', 'rest', 'BC', 'still a string?']);
  // });

  // test('retrieve content by search simple filter', async () => {
  //   const profileId = '4863f84d-7ca5-4a00-bd80-b0c87e005713';
  //   const filters = { type: 'video' };
  //   const encodedFilters = encodeURIComponent(JSON.stringify(filters));

  //   const getContentResponse = await contentApi.get(
  //     `/content/?profileId=${profileId}&filters=${encodedFilters}`
  //   );
  //   const { status: getContentStatus, data: getContentData } = getContentResponse;

  //   expect(getContentStatus).toEqual(200);
  //   expect(getContentData.data[0]).toHaveProperty('profileId');
  //   expect(getContentData.data[0]).toHaveProperty('type', 'video');
  //   expect(getContentData.data[0]).toHaveProperty('description', 'This is a test');
  //   expect(getContentData.data[0]).toHaveProperty('tags', ['exercises', 'art', 'rest', 'BC', 'still a string?']);
  // });
});

afterAll(async () => {
  for (const contentId in contentIdList) {
    const deleteContentResponse = await contentApi.delete(
      `/content/${contentIdList[contentId]}`,
      getAuthReqOpts('contentEditor')
    );
    expect(deleteContentResponse.status).toEqual(200);
  }
});
