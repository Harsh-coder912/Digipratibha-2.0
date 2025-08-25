import { Router } from 'express';
import { User } from '../models/User';

const router = Router();

router.get('/search', async (req, res) => {
  const { skill } = req.query as { skill?: string };
  const filter: Record<string, unknown> = {};
  if (skill) filter.skills = { $in: [skill] };
  const users = await User.find(filter).select('name username skills profilePicture bio');
  return res.json({ users });
});

export default router;



