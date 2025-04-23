const request = require('supertest');
const app = require('../server');

describe('/apa/metadata endpoint', () => {
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

  test('should return 200 with valid parameters', async () => {
    const response = await request(app)
      .get('/apa/metadata')
      .query(validParams);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('metadata');
  });

  test('should return 400 with missing required parameters', async () => {
    const response = await request(app)
      .get('/apa/metadata')
      .query({ authpn: 'tataelxsi' });
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  test('should return 400 with invalid parameter values', async () => {
    const invalidParams = {
      authpn: 'invalid',
      authpt: 'invalid',
      device_category: 'invalid',
      device_type: 'invalid',
      device_model: 'invalid',
      device_manufacturer: 'invalid',
      api_version: 'invalid',
      region: 'test-region',
      user_id: 'abc',
      sessionKey: 'test-session-key'
    };

    const response = await request(app)
      .get('/apa/metadata')
      .query(invalidParams);
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});