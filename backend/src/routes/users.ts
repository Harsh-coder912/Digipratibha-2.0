import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import { User } from '../models/User';

const router = Router();

router.get('/users/me', authMiddleware, async (req: AuthRequest, res) => {
  const user = await User.findById(req.user!.id).select('-passwordHash');
  if (!user) return res.status(404).json({ error: 'Not found' });
  return res.json({ user });
});

router.put(
  '/users/me',
  authMiddleware,
  [
    body('bio').optional().isString().isLength({ max: 2000 }),
    body('skills').optional().isArray(),
    body('socialLinks').optional().isObject(),
    body('socialLinks.github').optional().isString(),
    body('socialLinks.linkedin').optional().isString(),
    body('socialLinks.portfolio').optional().isString(),
  ],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const update = {
      bio: req.body.bio,
      skills: req.body.skills,
      socialLinks: req.body.socialLinks,
    };
    const user = await User.findByIdAndUpdate(req.user!.id, update, { new: true }).select(
      '-passwordHash'
    );
    return res.json({ user });
  }
);

export default router;



