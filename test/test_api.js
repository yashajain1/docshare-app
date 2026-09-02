const request = require('supertest');
const app = require('../server');

describe('basic api', () => {
  it('returns 401 for /api/docs when not logged in', async () => {
    const res = await request(app).get('/api/docs');
    expect(res.statusCode).toBe(401);
  });
});
