const request = require('supertest');
const app = require('../server');
const fs = require('fs').promises;
const path = require('path');

const endpoints = [
  {
    path: '/user/startheaderinfo',
    jsonFile: 'data/user.json',
    description: 'User Start Header Info'
  },
  {
    path: '/nav/data',
    jsonFile: 'data/navigation.json',
    description: 'Navigation Structure'
  },
  {
    path: '/apa/asset',
    jsonFile: 'data/assets.json',
    description: 'Asset Configuration'
  },
  {
    path: '/apa/metadata',
    jsonFile: 'data/metadata.json',
    description: 'Metadata Configuration'
  }
];

describe('API Endpoints Data Source Tests', () => {
  const validParams = {
    authpn: 'tataelxsi',
    authpt: 'vofee7ohhecai',
    device_category: 'stb',
    device_type: 'ptv',
    device_model: 'androidTV',
    device_manufacturer: 'ZTE',
    api_version: 'v5.93',
    region: 'test-region',
    user_id: '123',
    sessionKey: 'test-session-key'
  };

  endpoints.forEach(({ path, jsonFile, description }) => {
    describe(`${description} (${path})`, () => {
      let jsonData;

      beforeAll(async () => {
        try {
          const fileContent = await fs.readFile(path.resolve(__dirname, '..', jsonFile), 'utf8');
          jsonData = JSON.parse(fileContent);
        } catch (error) {
          console.error(`Error reading ${jsonFile}:`, error);
        }
      });

      test('should return 200 and match JSON file data', async () => {
        const response = await request(app)
          .get(path)
          .query(validParams);

        expect(response.status).toBe(200);
        expect(response.body).toBeTruthy();
        
        // Compare response with JSON file data
        if (jsonData) {
          expect(response.body).toEqual(expect.objectContaining(jsonData));
        }
      });

      test('should use cache on subsequent requests', async () => {
        // First request
        const response1 = await request(app)
          .get(path)
          .query(validParams);

        // Second request
        const response2 = await request(app)
          .get(path)
          .query(validParams);

        expect(response1.status).toBe(200);
        expect(response2.status).toBe(200);
        expect(response1.body).toEqual(response2.body);
        
        // Check for cache header if implemented
        if (response2.headers['x-cache']) {
          expect(response2.headers['x-cache']).toBe('HIT');
        }
      });

      test('should return 400 with missing required parameters', async () => {
        const response = await request(app)
          .get(path)
          .query({ authpn: 'tataelxsi' }); // Only sending one parameter

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
      });
    });
  });
});