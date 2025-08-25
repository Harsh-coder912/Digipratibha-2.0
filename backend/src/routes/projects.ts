import { Router, Response } from 'express';
import { body } from 'express-validator';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { Project } from '../models/Project';

const router = Router();

router.post(
  '/projects',
  authMiddleware,
  [body('title').isString().notEmpty()],
  async (req: AuthRequest, res: Response) => {
    const { title, description, category, fileUrl } = req.body as { title: string; description?: string; category?: string; fileUrl?: string };
    const item = await Project.create({ userId: req.user!.id, title, description, techStack: category ? [category] : [], liveUrl: fileUrl });
    return res.status(201).json({ item });
  }
);

router.get('/projects', authMiddleware, async (req: AuthRequest, res: Response) => {
  const items = await Project.find({ userId: req.user!.id }).sort({ createdAt: -1 });
  return res.json({ items });
});

router.get('/projects/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const item = await Project.findOne({ _id: req.params.id, userId: req.user!.id });
  if (!item) return res.status(404).json({ error: 'Not found' });
  return res.json({ item });
});

export default router;


