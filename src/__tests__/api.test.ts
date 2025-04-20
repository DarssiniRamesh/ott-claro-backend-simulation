import request from 'supertest';
import app from '../server';
import mongoose from 'mongoose';

describe('API Endpoints Tests', () => {
  beforeAll(async () => {
    // Ensure database is connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test');
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('User Start Header Info Endpoint - POST /api/user/startheaderinfo', () => {
    const validPayload = {
      deviceId: 'device123',
      region: 'US',
      platform: 'android',
      appVersion: '1.0.0'
    };

    test('should accept valid user session request', async () => {
      const response = await request(app)
        .post('/api/user/startheaderinfo')
        .send(validPayload);
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('userId');
    });

    test('should reject invalid device ID format', async () => {
      const response = await request(app)
        .post('/api/user/startheaderinfo')
        .send({ ...validPayload, deviceId: '@invalid!' });
      
      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });

    test('should reject invalid region format', async () => {
      const response = await request(app)
        .post('/api/user/startheaderinfo')
        .send({ ...validPayload, region: 'USA' });
      
      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });
  });

  describe('Navigation Structure Endpoint - GET /api/nav/data', () => {
    test('should return navigation structure', async () => {
      const response = await request(app)
        .get('/api/nav/data')
        .set('Authorization', 'Bearer test-token');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('navigation');
      expect(Array.isArray(response.body.data.navigation)).toBe(true);
    });

    test('should reject unauthorized request', async () => {
      const response = await request(app)
        .get('/api/nav/data');
      
      expect(response.status).toBe(401);
    });
  });

  describe('Asset Configuration Endpoint - GET /api/apa/asset', () => {
    test('should return asset configuration', async () => {
      const response = await request(app)
        .get('/api/apa/asset')
        .query({ id: 'asset123', deviceId: 'device123' })
        .set('Authorization', 'Bearer test-token');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('streamUrl');
    });

    test('should reject request without required parameters', async () => {
      const response = await request(app)
        .get('/api/apa/asset')
        .set('Authorization', 'Bearer test-token');
      
      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });

    test('should handle non-existent asset', async () => {
      const response = await request(app)
        .get('/api/apa/asset')
        .query({ id: 'nonexistent', deviceId: 'device123' })
        .set('Authorization', 'Bearer test-token');
      
      expect(response.status).toBe(404);
      expect(response.body.status).toBe('fail');
    });
  });

  describe('Metadata Configuration Endpoint - GET /api/apa/metadata', () => {
    test('should return metadata configuration', async () => {
      const response = await request(app)
        .get('/api/apa/metadata')
        .query({ id: 'asset123' })
        .set('Authorization', 'Bearer test-token');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('assetId');
      expect(response.body.data).toHaveProperty('title');
    });

    test('should accept optional language parameter', async () => {
      const response = await request(app)
        .get('/api/apa/metadata')
        .query({ id: 'asset123', language: 'es' })
        .set('Authorization', 'Bearer test-token');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    });

    test('should reject invalid asset ID', async () => {
      const response = await request(app)
        .get('/api/apa/metadata')
        .query({ id: '' })
        .set('Authorization', 'Bearer test-token');
      
      expect(response.status).toBe(400);
      expect(response.body.status).toBe('error');
    });
  });

  describe('Error Handling', () => {
    test('should handle internal server errors gracefully', async () => {
      // Trigger an internal error by passing malformed data
      const response = await request(app)
        .post('/api/user/startheaderinfo')
        .send({ malformed: 'data' });
      
      expect(response.status).toBe(500);
      expect(response.body.status).toBe('error');
      expect(response.body).toHaveProperty('message');
    });

    test('should handle rate limiting', async () => {
      // Make multiple requests in quick succession
      const requests = Array(10).fill(null).map(() =>
        request(app)
          .get('/api/nav/data')
          .set('Authorization', 'Bearer test-token')
      );
      
      const responses = await Promise.all(requests);
      const tooManyRequests = responses.some(r => r.status === 429);
      expect(tooManyRequests).toBe(true);
    });
  });
});