import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import cloudinary from '../config/cloudinary';

const router = Router();

function isAllowedMime(mime: string) {
  const allowed = ['image/png', 'image/jpeg', 'image/webp', 'application/pdf'];
  return allowed.includes(mime);
}

router.post('/uploads/documents', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { file, fileName, mimeType, folder } = req.body as {
      file: string; // base64 data URL or raw base64
      fileName?: string;
      mimeType?: string;
      folder?: string;
    };
    if (!file) return res.status(400).json({ error: 'file is required (base64)' });
    if (mimeType && !isAllowedMime(mimeType)) {
      return res.status(400).json({ error: 'Invalid file type' });
    }
    const upload = await cloudinary.uploader.upload(file, {
      folder: folder || 'digipratibha/documents',
      resource_type: 'auto',
      use_filename: true,
      filename_override: fileName,
    });
    return res.json({ url: upload.secure_url, public_id: upload.public_id });
  } catch (err) {
    return res.status(500).json({ error: 'Upload failed' });
  }
});

router.post('/users/me/avatar', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { file } = req.body as { file: string };
    if (!file) return res.status(400).json({ error: 'file is required (base64)' });
    const upload = await cloudinary.uploader.upload(file, {
      folder: 'digipratibha/avatars',
      resource_type: 'image',
      transformation: [{ width: 256, height: 256, crop: 'fill', gravity: 'face' }],
    });
    return res.json({ url: upload.secure_url });
  } catch (err) {
    return res.status(500).json({ error: 'Avatar upload failed' });
  }
});

export default router;



