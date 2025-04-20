const request = require('supertest');
const app = require('../server');

describe('API Endpoints', () => {
  let authToken;

  beforeAll(async () => {
    // Assuming there's a login endpoint to get auth token
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        username: 'testuser',
        password: 'testpass'
      });
    authToken = loginResponse.body.token;
  });

  describe('POST /user/startheaderinfo', () => {
    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .post('/user/startheaderinfo')
        .send({
          deviceId: 'test-device',
          region: 'US'
        });
      expect(response.status).toBe(401);
    });

    it('should return 200 with valid auth token and data', async () => {
      const response = await request(app)
        .post('/user/startheaderinfo')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          deviceId: 'test-device',
          region: 'US'
        });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('sessionId');
    });

    it('should return 400 with invalid input', async () => {
      const response = await request(app)
        .post('/user/startheaderinfo')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          deviceId: '',
          region: ''
        });
      expect(response.status).toBe(400);
    });
  });

  describe('GET /nav/data', () => {
    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .get('/nav/data');
      expect(response.status).toBe(401);
    });

    it('should return 200 with valid auth token', async () => {
      const response = await request(app)
        .get('/nav/data')
        .set('Authorization', `Bearer ${authToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('navigation');
    });
  });

  describe('GET /apa/asset', () => {
    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .get('/apa/asset');
      expect(response.status).toBe(401);
    });

    it('should return 200 with valid auth token', async () => {
      const response = await request(app)
        .get('/apa/asset')
        .set('Authorization', `Bearer ${authToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('assetConfig');
    });

    it('should return 400 with invalid query parameters', async () => {
      const response = await request(app)
        .get('/apa/asset?invalid=true')
        .set('Authorization', `Bearer ${authToken}`);
      expect(response.status).toBe(400);
    });
  });

  describe('GET /apa/metadata', () => {
    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .get('/apa/metadata');
      expect(response.status).toBe(401);
    });

    it('should return 200 with valid auth token', async () => {
      const response = await request(app)
        .get('/apa/metadata')
        .set('Authorization', `Bearer ${authToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('metadata');
    });

    it('should return 400 with invalid query parameters', async () => {
      const response = await request(app)
        .get('/apa/metadata?invalid=true')
        .set('Authorization', `Bearer ${authToken}`);
      expect(response.status).toBe(400);
    });
  });
});