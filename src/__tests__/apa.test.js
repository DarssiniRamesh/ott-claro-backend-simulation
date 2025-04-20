const request = require('supertest');
const app = require('../server');
const { generateToken } = require('../utils/auth.util');

describe('APA (Asset and Metadata) API Endpoints', () => {
  let authToken;

  beforeAll(async () => {
    // Generate a test auth token
    authToken = generateToken({ id: 'test-user-id' });
  });

  describe('GET /apa/asset', () => {
    const validQueryParams = {
      id: 'test-asset-123',
      deviceId: 'test-device-123',
      resolution: '1080p',
      format: 'mp4'
    };

    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .get('/apa/asset')
        .query(validQueryParams);
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 200 with valid auth token and parameters', async () => {
      const response = await request(app)
        .get('/apa/asset')
        .set('Authorization', `Bearer ${authToken}`)
        .query(validQueryParams);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body.data).toHaveProperty('assetConfig');
      expect(response.body.data.assetConfig).toMatchObject({
        id: validQueryParams.id,
        title: expect.any(String),
        type: expect.stringMatching(/movie|series/),
        streamUrl: expect.any(String),
        thumbnailUrl: expect.any(String)
      });
    });

    it('should return 400 with missing required parameters', async () => {
      const response = await request(app)
        .get('/apa/asset')
        .set('Authorization', `Bearer ${authToken}`)
        .query({
          id: 'test-asset-123'
          // missing deviceId
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 with invalid parameter values', async () => {
      const response = await request(app)
        .get('/apa/asset')
        .set('Authorization', `Bearer ${authToken}`)
        .query({
          ...validQueryParams,
          resolution: 'invalid-resolution'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should handle non-existent asset ID', async () => {
      const response = await request(app)
        .get('/apa/asset')
        .set('Authorization', `Bearer ${authToken}`)
        .query({
          ...validQueryParams,
          id: 'non-existent-asset'
        });
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /apa/metadata', () => {
    const validQueryParams = {
      id: 'test-asset-123',
      language: 'en'
    };

    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .get('/apa/metadata')
        .query(validQueryParams);
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 200 with valid auth token and parameters', async () => {
      const response = await request(app)
        .get('/apa/metadata')
        .set('Authorization', `Bearer ${authToken}`)
        .query(validQueryParams);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body.data).toHaveProperty('metadata');
      expect(response.body.data.metadata).toMatchObject({
        assetId: validQueryParams.id,
        title: expect.any(String),
        description: expect.any(String),
        releaseYear: expect.any(Number),
        genres: expect.any(Array),
        cast: expect.any(Array),
        language: validQueryParams.language
      });
    });

    it('should return 400 with missing required parameters', async () => {
      const response = await request(app)
        .get('/apa/metadata')
        .set('Authorization', `Bearer ${authToken}`)
        .query({
          // missing id
          language: 'en'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should handle invalid language parameter', async () => {
      const response = await request(app)
        .get('/apa/metadata')
        .set('Authorization', `Bearer ${authToken}`)
        .query({
          ...validQueryParams,
          language: 'invalid-lang'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should use default language when language parameter is omitted', async () => {
      const response = await request(app)
        .get('/apa/metadata')
        .set('Authorization', `Bearer ${authToken}`)
        .query({
          id: validQueryParams.id
        });
      
      expect(response.status).toBe(200);
      expect(response.body.data.metadata.language).toBe('en'); // Assuming 'en' is default
    });

    it('should handle non-existent asset ID', async () => {
      const response = await request(app)
        .get('/apa/metadata')
        .set('Authorization', `Bearer ${authToken}`)
        .query({
          ...validQueryParams,
          id: 'non-existent-asset'
        });
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
    });
  });
});
