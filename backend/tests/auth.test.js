const request = require('supertest');
const app = require('../src/server');
const prisma = require('../src/prismaClient');

beforeAll(async () => {
  await prisma.developerProfile.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Auth', () => {
  test('register and login', async () => {
    const email = 'testuser@example.com';
    const password = 'testpass';
    let res = await request(app).post('/api/auth/register').send({ email, password, name: 'Tester' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeTruthy();

    res = await request(app).post('/api/auth/login').send({ email, password });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeTruthy();
  });
});
