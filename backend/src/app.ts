import cors from 'cors';
import pino from 'pino-http';
import { z } from 'zod';
import express from 'express';
import healthRoutes from './routes/health';
import authRoutes from './routes/auth';
import usersRoutes from './routes/users';
import uploadsRoutes from './routes/uploads';
import searchRoutes from './routes/search';
import adminRoutes from './routes/admin';
import publicRoutes from './routes/public';
import portfolioRoutes from './routes/portfolio';
import aiRoutes from './routes/ai';
import projectsRoutes from './routes/projects';
import resourcesRoutes from './routes/resources';
import feedbackRoutes from './routes/feedback';

const app = express();

const envSchema = z.object({
  OPENAI_API_KEY: z.string().optional(),
});
envSchema.parse(process.env);

app.use(pino({ transport: { target: 'pino-pretty' } }));
app.use(cors());
app.use(express.json());

app.use('/api', healthRoutes);
app.use('/api', authRoutes);
app.use('/api', usersRoutes);
app.use('/api', uploadsRoutes);
app.use('/api', searchRoutes);
app.use('/api', adminRoutes);
app.use('/api', publicRoutes);
app.use('/api', portfolioRoutes);
app.use('/api', aiRoutes);
app.use('/api', projectsRoutes);
app.use('/api', resourcesRoutes);
app.use('/api', feedbackRoutes);

// TODO: add more routes (profiles, portfolios, media uploads)

export default app;


