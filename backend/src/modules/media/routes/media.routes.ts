import { Router } from 'express';
import multer from 'multer';
import * as mediaController from '../controllers/media.controller.js';
import { authenticateToken, requireAdmin } from '../../../middleware/auth.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

router.use(authenticateToken, requireAdmin);

router.post('/upload', upload.single('file'), mediaController.uploadMedia);
router.get('/presign', mediaController.getPresignedUrl);
router.get('/list', mediaController.listMedia);

export default router;
