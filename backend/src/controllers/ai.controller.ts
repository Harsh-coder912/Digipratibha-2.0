import type { Request, Response } from 'express';
import { embedText, generateCareerRecommendations, chatbotAnswer, analyzeProjectIdea, summarizeAdminStats } from '../services/ai.service';
import { Resource } from '../models/Resource';
import { AuthRequest } from '../middleware/auth';

// Simple in-memory cache for recommendations keyed by JSON input
const recommendationCache = new Map<string, any>();

export async function postCareerRecommendation(req: AuthRequest, res: Response) {
  const key = JSON.stringify(req.body || {});
  if (recommendationCache.has(key)) return res.json(recommendationCache.get(key));
  const recommendations = await generateCareerRecommendations(req.body as { skills: string[]; interests: string[]; educationLevel: string });
  const payload = { recommendedCareers: recommendations };
  recommendationCache.set(key, payload);
  return res.json(payload);
}

export async function getSemanticSearch(req: Request, res: Response) {
  const query = (req.query.query as string) || '';
  if (!query) return res.status(400).json({ error: 'query required' });
  const qEmbedding = await embedText(query);
  const resources = await Resource.find({ embedding: { $exists: true } }).lean();
  function cosine(a: number[], b: number[]) {
    let dot = 0, na = 0, nb = 0;
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
      dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i];
    }
    return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-8);
  }
  const ranked = resources
    .map((r: any) => ({ r, score: cosine(qEmbedding, r.embedding || []) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((x) => ({ ...x.r, score: x.score }));
  return res.json({ results: ranked });
}

export async function postChatbot(req: Request, res: Response) {
  const { question } = req.body as { question?: string };
  if (!question) return res.status(400).json({ error: 'question required' });
  const kb = [
    { q: 'admission', a: 'Admissions open from April to July. Visit admissions office or apply online.' },
    { q: 'courses', a: 'We offer B.Tech, B.Sc, M.Tech, MBA, and various diploma programs.' },
    { q: 'campus', a: 'Our campus has modern labs, libraries, hostels, sports complex, and cafeterias.' },
    { q: 'contact', a: 'Reach us at contact@college.edu or call +91-12345-67890.' },
  ];
  const answer = await chatbotAnswer(question, kb);
  return res.json({ answer });
}

export async function postAnalyzeProject(req: Request, res: Response) {
  const { projectTitle, description } = req.body as { projectTitle?: string; description?: string };
  if (!projectTitle || !description) return res.status(400).json({ error: 'projectTitle and description required' });
  const result = await analyzeProjectIdea({ projectTitle, description });
  return res.json(result);
}

export async function getAdminAISummary(_req: Request, res: Response) {
  // For demo, we can call summarize with counts; real impl can compute last 7d
  // Lazy import to avoid coupling
  const { User } = await import('../models/User');
  const { Project } = await import('../models/Project');
  const { Feedback } = await import('../models/Feedback');
  const users = await User.countDocuments();
  const projects = await Project.countDocuments();
  const feedback = await Feedback.countDocuments();
  const text = await summarizeAdminStats({ users, projects, feedback });
  return res.json({ summary: text });
}
