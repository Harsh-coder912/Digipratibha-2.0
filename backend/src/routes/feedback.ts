import { Router, Response } from 'express';
import { body } from 'express-validator';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { Feedback } from '../models/Feedback';

const router = Router();

router.post(
  '/feedback',
  authMiddleware,
  [body('message').isString().notEmpty()],
  async (req: AuthRequest, res: Response) => {
    const { message, rating } = req.body as { message: string; rating?: number };
    const item = await Feedback.create({ user: req.user!.id, message, rating });
    return res.status(201).json({ item });
  }
);

export default router;


