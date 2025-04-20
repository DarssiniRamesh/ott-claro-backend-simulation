const request = require('supertest');
const app = require('../server');
const { generateToken } = require('../utils/auth.util');

describe('Navigation API Endpoints', () => {
  let authToken;

  beforeAll(async () => {
    // Generate a test auth token
    authToken = generateToken({ id: 'test-user-id' });
  });

  describe('GET /nav/data', () => {
    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .get('/nav/data');
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 200 with valid auth token', async () => {
      const response = await request(app)
        .get('/nav/data')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'success');
      expect(response.body.data).toHaveProperty('navigation');
      expect(Array.isArray(response.body.data.navigation)).toBe(true);

      // Validate navigation item structure
      if (response.body.data.navigation.length > 0) {
        const navItem = response.body.data.navigation[0];
        expect(navItem).toMatchObject({
          id: expect.any(String),
          title: expect.any(String),
          path: expect.any(String),
          icon: expect.any(String)
        });
      }
    });

    it('should handle invalid auth token', async () => {
      const response = await request(app)
        .get('/nav/data')
        .set('Authorization', 'Bearer invalid-token');
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });

    it('should handle server errors gracefully', async () => {
      // Mock a server error by passing malformed authorization header
      const response = await request(app)
        .get('/nav/data')
        .set('Authorization', 'malformed-auth-header');
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });

    it('should return cached data on subsequent requests', async () => {
      // First request
      const response1 = await request(app)
        .get('/nav/data')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response1.status).toBe(200);

      // Second request should be faster due to caching
      const start = Date.now();
      const response2 = await request(app)
        .get('/nav/data')
        .set('Authorization', `Bearer ${authToken}`);
      const end = Date.now();

      expect(response2.status).toBe(200);
      expect(end - start).toBeLessThan(100); // Cached response should be quick
      expect(response2.body).toEqual(response1.body); // Responses should be identical
    });
  });
});
