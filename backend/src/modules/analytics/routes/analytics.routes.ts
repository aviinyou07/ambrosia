import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller.js';
import { authenticateToken, requireAdmin } from '../../../middleware/auth.js';

const router = Router();

router.use(authenticateToken, requireAdmin);

router.get('/dashboard', analyticsController.getDashboardSummary);
router.get('/revenue-trend', analyticsController.getRevenueTrend);

export default router;
