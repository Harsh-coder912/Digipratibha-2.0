import { Router } from 'express';
import { User } from '../models/User';

const router = Router();

router.get('/users/:username/public', async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username }).select(
    'name username bio skills socialLinks profilePicture'
  );
  if (!user) return res.status(404).json({ error: 'Not found' });
  // TODO: include portfolio data once models exist
  return res.json({ user, portfolio: { education: [], projects: [], certifications: [], skills: user.skills, achievements: [] } });
});

export default router;



