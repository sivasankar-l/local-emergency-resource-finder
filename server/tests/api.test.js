const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../src/app');
const { seedDatabase } = require('../src/scripts/seedResources');
const { createAdminUser } = require('../src/scripts/createAdmin');
const { calculateHaversineDistance } = require('../src/utils/geoUtils');

let mongod;
let adminToken;
let testResourceId;

describe('Local Emergency Resource Finder - Backend API Test Suite', () => {
  before(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);

    // Seed database
    await seedDatabase();

    // Create admin user for testing
    await createAdminUser(
      'Test Admin',
      'testadmin@vit.ac.in',
      'TestPassword@123',
      'superadmin'
    );

    // Obtain JWT token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testadmin@vit.ac.in',
        password: 'TestPassword@123'
      });
    adminToken = loginRes.body.token;
  });

  after(async () => {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
  });

  // 1. Health check
  test('GET /api/health should return ok status and VIT project information', async () => {
    const res = await request(app).get('/api/health');
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.status, 'ok');
    assert.ok(res.body.institution.includes('Vellore Institute of Technology'));
  });

  // 2. Unit test: Haversine distance
  test('Haversine distance calculation should accurately measure distance in km', () => {
    // Vellore center to Katpadi junction is ~7.5 km
    const dist = calculateHaversineDistance(12.9165, 79.1325, 12.9815, 79.1412);
    assert.ok(dist > 6 && dist < 9, `Expected distance ~7.5km, got ${dist}`);
  });

  // 3. Categories API
  test('GET /api/resources/categories should return all 7 emergency categories with counts', async () => {
    const res = await request(app).get('/api/resources/categories');
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.length, 7);
    const categoryNames = res.body.data.map((c) => c.name);
    assert.ok(categoryNames.includes('Hospitals'));
    assert.ok(categoryNames.includes('Ambulance Services'));
    assert.ok(categoryNames.includes('Police Stations'));
    assert.ok(categoryNames.includes('Fire Stations'));
    assert.ok(categoryNames.includes('Pharmacies'));
    assert.ok(categoryNames.includes('Blood Banks'));
    assert.ok(categoryNames.includes('Emergency Shelters'));
  });

  // 4. Resource search and filtering
  test('GET /api/resources should return seeded records and support category filter', async () => {
    const resAll = await request(app).get('/api/resources');
    assert.strictEqual(resAll.statusCode, 200);
    assert.ok(resAll.body.total >= 7);
    testResourceId = resAll.body.data[0]._id;

    // Filter by Hospitals
    const resHosp = await request(app).get('/api/resources?category=Hospitals');
    assert.strictEqual(resHosp.statusCode, 200);
    resHosp.body.data.forEach((r) => {
      assert.strictEqual(r.category, 'Hospitals');
    });
  });

  // 5. Nearby endpoint
  test('GET /api/resources/nearby should calculate proximity and sort by distance', async () => {
    // Search around VIT Katpadi coordinates (12.9698, 79.1559)
    const res = await request(app).get('/api/resources/nearby?latitude=12.9698&longitude=79.1559&radius=15');
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.resources));
    assert.ok(res.body.resources.length > 0);

    // Verify distance is calculated and sorted asc
    let lastDist = -1;
    for (const r of res.body.resources) {
      assert.ok(r.distance !== null && r.distance !== undefined);
      assert.ok(r.distance >= lastDist);
      lastDist = r.distance;
    }
  });

  // 6. Nearby endpoint validation
  test('GET /api/resources/nearby without coordinates should return 400 error', async () => {
    const res = await request(app).get('/api/resources/nearby');
    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.success, false);
  });

  // 7. Single resource details
  test('GET /api/resources/:id should return resource details and 404 for invalid ID', async () => {
    const res = await request(app).get(`/api/resources/${testResourceId}`);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.data._id.toString(), testResourceId.toString());

    const res404 = await request(app).get('/api/resources/507f1f77bcf86cd799439011');
    assert.strictEqual(res404.statusCode, 404);
  });

  // 8. Public Feedback Submission
  test('POST /api/feedback should validate input and accept valid submission', async () => {
    // Missing required fields
    const invalidRes = await request(app)
      .post('/api/feedback')
      .send({ name: '' });
    assert.strictEqual(invalidRes.statusCode, 400);

    // Valid feedback
    const validRes = await request(app)
      .post('/api/feedback')
      .send({
        name: 'Vellore Citizen',
        email: 'citizen@vellore.in',
        subject: 'Feedback on Emergency Services Locator',
        message: 'This application provides rapid information for Katpadi and CMC hospitals.'
      });
    assert.strictEqual(validRes.statusCode, 201);
    assert.strictEqual(validRes.body.success, true);
  });

  // 9. Admin Authentication
  test('POST /api/auth/login should reject bad credentials and accept valid credentials', async () => {
    const badLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'testadmin@vit.ac.in', password: 'WrongPassword' });
    assert.strictEqual(badLogin.statusCode, 401);

    const goodLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'testadmin@vit.ac.in', password: 'TestPassword@123' });
    assert.strictEqual(goodLogin.statusCode, 200);
    assert.ok(goodLogin.body.token);
  });

  // 10. Admin Protected Routes
  test('GET /api/admin/stats should reject unauthorized request and allow with token', async () => {
    const unauthorized = await request(app).get('/api/admin/stats');
    assert.strictEqual(unauthorized.statusCode, 401);

    const authorized = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);
    assert.strictEqual(authorized.statusCode, 200);
    assert.ok(authorized.body.stats.totalResources > 0);
  });

  // 11. Admin Resource CRUD
  test('Admin should be able to create, update, and delete an emergency resource', async () => {
    // CREATE
    const createRes = await request(app)
      .post('/api/admin/resources')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'New Test Medical Center [DEMO]',
        category: 'Hospitals',
        address: 'Main Street Katpadi',
        city: 'Vellore',
        state: 'Tamil Nadu',
        latitude: 12.975,
        longitude: 79.145,
        phone: '+91-416-2200000',
        operatingHours: '24 Hours',
        services: ['General Emergency', 'First Aid'],
        verificationStatus: 'verified'
      });
    assert.strictEqual(createRes.statusCode, 201);
    const newId = createRes.body.data._id;

    // UPDATE
    const updateRes = await request(app)
      .put(`/api/admin/resources/${newId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Updated Test Medical Center [DEMO]',
        operatingHours: '24/7 Fully Staffed'
      });
    assert.strictEqual(updateRes.statusCode, 200);
    assert.strictEqual(updateRes.body.data.name, 'Updated Test Medical Center [DEMO]');

    // DELETE
    const deleteRes = await request(app)
      .delete(`/api/admin/resources/${newId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    assert.strictEqual(deleteRes.statusCode, 200);
    assert.strictEqual(deleteRes.body.success, true);
  });
});
