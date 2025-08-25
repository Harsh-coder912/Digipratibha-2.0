import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { getSemanticSearch, postAnalyzeProject, postCareerRecommendation, postChatbot, getAdminAISummary } from '../controllers/ai.controller';
import { requireAdmin } from '../middleware/auth';

const router = Router();

// Career recommendations (protected)
router.post('/ai/career-recommendation', authMiddleware, postCareerRecommendation);

// Semantic resource search (can be public or protected; keep protected to track usage)
router.get('/ai/search', authMiddleware, getSemanticSearch);

// Chatbot (public)
router.post('/ai/chatbot', postChatbot);

// Project analyzer (protected)
router.post('/ai/analyze-project', authMiddleware, postAnalyzeProject);

// Admin AI summary (admin only)
router.get('/admin/ai-summary', authMiddleware, requireAdmin, getAdminAISummary);

export default router;
