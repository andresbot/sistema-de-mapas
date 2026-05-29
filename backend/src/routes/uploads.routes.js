import { Router } from 'express';
import { getReviewUploadSignature } from '../controllers/uploadsController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.post('/uploads/signature', verifyToken, getReviewUploadSignature);

export default router;
