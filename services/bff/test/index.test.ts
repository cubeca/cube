import request from 'supertest';
import { app, server } from '../src/index';
import * as microservices from '../src/microservices';

jest.mock('../src/microservices');

const mockProfileApi = microservices.profileApi as jest.Mocked<typeof microservices.profileApi>;
const mockIdentityApi = microservices.identityApi as jest.Mocked<typeof microservices.identityApi>;

describe('Profile API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll((done) => {
    server.close(done);
  });

  it('should return the result of the forgot-password request', async () => {
    const email = 'test@example.com';
    const queryParams = { email };
    const expectedResult = { message: 'Password reset email sent' };

    mockIdentityApi.get.mockResolvedValueOnce({
      status: 200,
      data: expectedResult,
    });

    const response = await request(app).get('/auth/forgot-password').query(queryParams);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResult);
    expect(mockIdentityApi.get).toHaveBeenCalledWith('auth/forgot-password', { params: queryParams });
  });

  it('should create a profile', async () => {
    const profileData = {
        id: 'c141667d-50fc-4610-99f4-b87fcd6f77aa',
        name: 'First Organization',
        website: 'https://www.firstorganization.org',
        tag: '@firstorg'
    };

    mockProfileApi.post.mockResolvedValue({
      status: 200,
      data: profileData.id
    });

    const response = await request(app).post('/profiles').send(profileData);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(profileData.id);
    expect(mockProfileApi.post).toHaveBeenCalledWith('profiles/', profileData);
  });

  it('should get a profile by id', async () => {
    const profileId = 'c141667d-50fc-4610-99f4-b87fcd6f77aa';
    const profileData = {
      id: profileId,
      name: 'First Organization',
      website: 'https://www.firstorganization.org',
      tag: '@firstorg'
    };

    mockProfileApi.get.mockResolvedValue({
      status: 200,
      data: profileData
    });

    const response = await request(app).get(`/profiles/${profileId}`);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(profileData);
    expect(mockProfileApi.get).toHaveBeenCalledWith(`profiles/${profileId}`);
  });

  it('should return a 200 status for the index route', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });
});
