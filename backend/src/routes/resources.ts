import { Router, Response } from 'express';
import { body } from 'express-validator';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { Resource } from '../models/Resource';
import { embedText } from '../services/ai.service';

const router = Router();

router.post(
  '/resources',
  authMiddleware,
  [body('title').isString().notEmpty(), body('link').isString().notEmpty()],
  async (req: AuthRequest, res: Response) => {
    const { title, type, link } = req.body as { title: string; type?: string; link: string };
    let embedding: number[] | undefined = undefined;
    try {
      embedding = await embedText(`${title} ${link}`);
    } catch {}
    const item = await Resource.create({ title, type, link, uploadedBy: req.user!.id, embedding });
    return res.status(201).json({ item });
  }
);

router.get('/resources', authMiddleware, async (_req: AuthRequest, res: Response) => {
  const items = await Resource.find().sort({ createdAt: -1 });
  return res.json({ items });
});

export default router;


