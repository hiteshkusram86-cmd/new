const request = require('supertest');
const app = require('../src/server');
const prisma = require('../src/prismaClient');

let token;

beforeAll(async () => {
  await prisma.developerProfile.deleteMany();
  await prisma.user.deleteMany();
  const res = await request(app).post('/api/auth/register').send({ email: 'puser@example.com', password: 'pass123', name: 'Puser' });
  token = res.body.token;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Profiles', () => {
  test('create profile', async () => {
    const res = await request(app).post('/api/profiles').set('Authorization', `Bearer ${token}`).send({ title: 'Tester', bio: 'bio', skills: 'js,react' });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Tester');
  });

  test('list profiles', async () => {
    const res = await request(app).get('/api/profiles');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
