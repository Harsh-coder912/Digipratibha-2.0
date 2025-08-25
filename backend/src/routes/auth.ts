import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { config } from '../config/default';

const router = Router();

router.post('/auth/register', async (req, res) => {
  try {
    const { name, username, email, password } = req.body as { name: string; username: string; email: string; password: string };
    if (!name || !username || !email || !password) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ error: 'Username already taken' });
    }
    const passwordHash = await bcrypt.hash(password, config.bcryptSaltRounds);
    const user = await User.create({ name, username, email, passwordHash });
    const accessToken = jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id }, config.jwtRefreshSecret, { expiresIn: '7d' });
    return res.status(201).json({ token: accessToken, refreshToken, user: { id: user._id, name: user.name, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const accessToken = jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id }, config.jwtRefreshSecret, { expiresIn: '7d' });
    return res.json({ token: accessToken, refreshToken, user: { id: user._id, name: user.name, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/auth/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body as { refreshToken?: string };
    if (!refreshToken) return res.status(400).json({ error: 'Missing refresh token' });
    const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret) as { id: string };
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ error: 'Invalid token' });
    const accessToken = jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, { expiresIn: '15m' });
    return res.json({ token: accessToken });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;


