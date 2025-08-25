import { Router } from 'express';
import { authMiddleware, requireAdmin } from '../middleware/auth';
import { User } from '../models/User';
import { Project } from '../models/Project';
import { Feedback } from '../models/Feedback';

const router = Router();

router.get('/admin/users', authMiddleware, requireAdmin, async (_req, res) => {
  const users = await User.find().select('-passwordHash');
  const stats = {
    usersCount: await User.countDocuments(),
    projectsCount: await Project.countDocuments(),
    feedbackCount: await Feedback.countDocuments(),
  };
  return res.json({ users, stats });
});

router.delete('/admin/users/:id', authMiddleware, requireAdmin, async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  return res.json({ ok: true });
});

export default router;



