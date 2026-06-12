import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import prisma from '../src/models/prisma';

describe('WADU API Integration Tests', () => {
  beforeAll(async () => {
    try {
      await prisma.$connect();
    } catch (err) {
      console.warn('Could not connect to database for tests, skipping database validation checks:', err);
    }
  });

  describe('GET /api/categories', () => {
    it('should return a list of categories', async () => {
      const res = await request(app).get('/api/categories');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('GET /api/cities', () => {
    it('should return a list of cities', async () => {
      const res = await request(app).get('/api/cities');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('GET /api/events', () => {
    it('should return paginated events list', async () => {
      const res = await request(app).get('/api/events');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.events).toBeDefined();
      expect(Array.isArray(res.body.data.events)).toBe(true);
    });
  });

  describe('POST /api/auth/register - validation failure', () => {
    it('should return 400 Bad Request if fields are missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
        });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
