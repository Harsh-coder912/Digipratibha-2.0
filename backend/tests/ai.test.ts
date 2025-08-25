import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app';
import { User } from '../src/models/User';
import jwt from 'jsonwebtoken';
import { config } from '../src/config/default';

jest.mock('openai', () => {
  return function MockedOpenAI() {
    return {
      embeddings: { create: async () => ({ data: [{ embedding: [0.1, 0.2, 0.3] }] }) },
      chat: {
        completions: {
          create: async ({ messages }: any) => {
            const last = messages[messages.length - 1]?.content || '';
            if (String(last).includes('Analyze')) {
              return { choices: [{ message: { content: JSON.stringify({ strengths: ['clear scope'], weaknesses: ['needs data'], suggestions: ['add tests'] }) } }] };
            }
            if (String(last).includes('Summarize')) {
              return { choices: [{ message: { content: 'Summary ok' } }] };
            }
            if (String(last).includes('Suggest 5 relevant career paths')) {
              return { choices: [{ message: { content: JSON.stringify([{ title: 'Software Engineer', description: 'Build software', requiredSkills: ['JS'], learningPath: ['Learn JS'] }]) } }] };
            }
            return { choices: [{ message: { content: 'Bot answer' } }] };
          },
        },
      },
    } as any;
  };
});

function signToken(id: string, role: 'student' | 'admin' = 'student') {
  return jwt.sign({ id, role }, config.jwtSecret, { expiresIn: '1h' });
}

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

test('POST /api/ai/career-recommendation returns recommendations', async () => {
  const u = await User.create({ name: 'A', username: 'a', email: 'a@a.com', passwordHash: 'x' });
  const token = signToken(u.id);
  const res = await request(app)
    .post('/api/ai/career-recommendation')
    .set('Authorization', `Bearer ${token}`)
    .send({ skills: ['JS'], interests: ['Web'], educationLevel: 'UG' })
    .expect(200);
  expect(Array.isArray(res.body.recommendedCareers)).toBe(true);
});

test('GET /api/ai/search returns results', async () => {
  const u = await User.create({ name: 'B', username: 'b', email: 'b@b.com', passwordHash: 'x' });
  const token = signToken(u.id);
  const res = await request(app)
    .get('/api/ai/search?query=test')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);
  expect(res.body).toHaveProperty('results');
});

test('POST /api/ai/chatbot returns answer (public)', async () => {
  const res = await request(app)
    .post('/api/ai/chatbot')
    .send({ question: 'admission' })
    .expect(200);
  expect(res.body).toHaveProperty('answer');
});

test('POST /api/ai/analyze-project returns analysis', async () => {
  const u = await User.create({ name: 'C', username: 'c', email: 'c@c.com', passwordHash: 'x' });
  const token = signToken(u.id);
  const res = await request(app)
    .post('/api/ai/analyze-project')
    .set('Authorization', `Bearer ${token}`)
    .send({ projectTitle: 'Title', description: 'Description' })
    .expect(200);
  expect(res.body).toHaveProperty('strengths');
  expect(res.body).toHaveProperty('weaknesses');
  expect(res.body).toHaveProperty('suggestions');
});

test('GET /api/admin/ai-summary (admin only)', async () => {
  const u = await User.create({ name: 'D', username: 'd', email: 'd@d.com', passwordHash: 'x', role: 'admin' });
  const token = signToken(u.id, 'admin');
  const res = await request(app)
    .get('/api/admin/ai-summary')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);
  expect(res.body).toHaveProperty('summary');
});

