const request = require('supertest');
const app = require('../server');
const { generateToken } = require('../utils/auth.util');

describe('User API Endpoints', () => {
  let authToken;

  beforeAll(async () => {
    // Generate a test auth token
    authToken = generateToken({ id: 'test-user-id' });
  });

  describe('POST /user/startheaderinfo', () => {
    const validPayload = {
      deviceId: 'test-device-123',
      region: 'US',
      platform: 'android',
      appVersion: '1.0.0'
    };

    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .post('/user/startheaderinfo')
        .send(validPayload);
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 200 with valid auth token and data', async () => {
      const response = await request(app)
        .post('/user/startheaderinfo')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validPayload);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body.data).toHaveProperty('headerInfo');
      expect(response.body.data.headerInfo).toMatchObject({
        deviceId: validPayload.deviceId,
        region: validPayload.region
      });
    });

    it('should return 400 with missing required fields', async () => {
      const response = await request(app)
        .post('/user/startheaderinfo')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          deviceId: 'test-device'
          // missing region, platform, and appVersion
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 with invalid field values', async () => {
      const response = await request(app)
        .post('/user/startheaderinfo')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...validPayload,
          deviceId: '' // empty device ID
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /user/startheaderinfo', () => {
    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .get('/user/startheaderinfo');
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 200 with valid auth token', async () => {
      const response = await request(app)
        .get('/user/startheaderinfo')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body.data).toHaveProperty('headerInfo');
      expect(response.body.data.headerInfo).toMatchObject({
        userId: expect.any(String),
        displayName: expect.any(String),
        avatar: expect.any(String),
        notifications: expect.any(Number)
      });
    });

    it('should handle server errors gracefully', async () => {
      // Simulate a server error by passing an invalid token
      const response = await request(app)
        .get('/user/startheaderinfo')
        .set('Authorization', 'Bearer invalid-token');
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });
  });
});
