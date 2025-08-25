import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { Education } from '../models/Education';
import { Project } from '../models/Project';
import { Certification } from '../models/Certification';
import { Skill } from '../models/Skill';
import { Achievement } from '../models/Achievement';

const router = Router();

function handleValidation(req: AuthRequest, res: any) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
}

// Generic helpers
function ownerFilter(userId: string) {
  return { userId } as const;
}

// Education CRUD
router.get('/portfolio/education', authMiddleware, async (req: AuthRequest, res) => {
  const items = await Education.find(ownerFilter(req.user!.id)).sort({ startDate: -1 });
  return res.json({ items });
});

router.post(
  '/portfolio/education',
  authMiddleware,
  [body('school').isString().notEmpty()],
  async (req: AuthRequest, res: Response) => {
    const bad = handleValidation(req, res);
    if (bad) return bad;
    const item = await Education.create({ ...req.body, userId: req.user!.id });
    return res.status(201).json({ item });
  }
);

router.put('/portfolio/education/:id', authMiddleware, async (req: AuthRequest, res) => {
  const item = await Education.findOneAndUpdate(
    { _id: req.params.id, userId: req.user!.id },
    req.body,
    { new: true }
  );
  return res.json({ item });
});

router.delete('/portfolio/education/:id', authMiddleware, async (req: AuthRequest, res) => {
  await Education.findOneAndDelete({ _id: req.params.id, userId: req.user!.id });
  return res.json({ ok: true });
});

// Projects CRUD
router.get('/portfolio/projects', authMiddleware, async (req: AuthRequest, res) => {
  const items = await Project.find(ownerFilter(req.user!.id)).sort({ createdAt: -1 });
  return res.json({ items });
});

router.post(
  '/portfolio/projects',
  authMiddleware,
  [body('title').isString().notEmpty()],
  async (req: AuthRequest, res: Response) => {
    const bad = handleValidation(req, res);
    if (bad) return bad;
    const item = await Project.create({ ...req.body, userId: req.user!.id });
    return res.status(201).json({ item });
  }
);

router.put('/portfolio/projects/:id', authMiddleware, async (req: AuthRequest, res) => {
  const item = await Project.findOneAndUpdate(
    { _id: req.params.id, userId: req.user!.id },
    req.body,
    { new: true }
  );
  return res.json({ item });
});

router.delete('/portfolio/projects/:id', authMiddleware, async (req: AuthRequest, res) => {
  await Project.findOneAndDelete({ _id: req.params.id, userId: req.user!.id });
  return res.json({ ok: true });
});

// Certification CRUD
router.get('/portfolio/certifications', authMiddleware, async (req: AuthRequest, res) => {
  const items = await Certification.find(ownerFilter(req.user!.id)).sort({ issueDate: -1 });
  return res.json({ items });
});

router.post(
  '/portfolio/certifications',
  authMiddleware,
  [body('name').isString().notEmpty()],
  async (req: AuthRequest, res: Response) => {
    const bad = handleValidation(req, res);
    if (bad) return bad;
    const item = await Certification.create({ ...req.body, userId: req.user!.id });
    return res.status(201).json({ item });
  }
);

router.put('/portfolio/certifications/:id', authMiddleware, async (req: AuthRequest, res) => {
  const item = await Certification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user!.id },
    req.body,
    { new: true }
  );
  return res.json({ item });
});

router.delete('/portfolio/certifications/:id', authMiddleware, async (req: AuthRequest, res) => {
  await Certification.findOneAndDelete({ _id: req.params.id, userId: req.user!.id });
  return res.json({ ok: true });
});

// Skill CRUD
router.get('/portfolio/skills', authMiddleware, async (req: AuthRequest, res) => {
  const items = await Skill.find(ownerFilter(req.user!.id)).sort({ createdAt: -1 });
  return res.json({ items });
});

router.post(
  '/portfolio/skills',
  authMiddleware,
  [body('name').isString().notEmpty()],
  async (req: AuthRequest, res: Response) => {
    const bad = handleValidation(req, res);
    if (bad) return bad;
    const item = await Skill.create({ ...req.body, userId: req.user!.id });
    return res.status(201).json({ item });
  }
);

router.delete('/portfolio/skills/:id', authMiddleware, async (req: AuthRequest, res) => {
  await Skill.findOneAndDelete({ _id: req.params.id, userId: req.user!.id });
  return res.json({ ok: true });
});

// Achievement CRUD
router.get('/portfolio/achievements', authMiddleware, async (req: AuthRequest, res) => {
  const items = await Achievement.find(ownerFilter(req.user!.id)).sort({ date: -1 });
  return res.json({ items });
});

router.post(
  '/portfolio/achievements',
  authMiddleware,
  [body('title').isString().notEmpty()],
  async (req: AuthRequest, res: Response) => {
    const bad = handleValidation(req, res);
    if (bad) return bad;
    const item = await Achievement.create({ ...req.body, userId: req.user!.id });
    return res.status(201).json({ item });
  }
);

router.put('/portfolio/achievements/:id', authMiddleware, async (req: AuthRequest, res) => {
  const item = await Achievement.findOneAndUpdate(
    { _id: req.params.id, userId: req.user!.id },
    req.body,
    { new: true }
  );
  return res.json({ item });
});

router.delete('/portfolio/achievements/:id', authMiddleware, async (req: AuthRequest, res) => {
  await Achievement.findOneAndDelete({ _id: req.params.id, userId: req.user!.id });
  return res.json({ ok: true });
});

export default router;



