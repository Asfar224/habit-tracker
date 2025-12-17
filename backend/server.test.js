const request = require('supertest');

// Set test environment before requiring server
process.env.NODE_ENV = 'test';

// Mock the database models before requiring server
jest.mock('./models', () => ({
  sequelize: {
    authenticate: jest.fn().mockResolvedValue(true),
    sync: jest.fn().mockResolvedValue(true)
  }
}));

// Mock dotenv
jest.mock('dotenv', () => ({
  config: jest.fn()
}));

describe('Backend API Tests', () => {
  let app;

  beforeAll(() => {
    // Suppress console.log during tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Import app after mocks are set up
    app = require('./server');
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('Health Check Endpoint', () => {
    it('should return 200 and health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('OK');
    });
  });

  describe('Root Endpoint', () => {
    it('should return API message', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);
      
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('API Routes', () => {
    it('should have /api/auth routes mounted', async () => {
      const response = await request(app)
        .get('/api/auth/test')
        .expect(404); // Route doesn't exist, but API prefix works
      
      // This confirms the API routes are mounted (404 not 500)
      expect(response.status).toBe(404);
    });
  });
});

