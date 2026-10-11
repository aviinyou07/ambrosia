import { Router } from 'express';
import * as returnController from '../controllers/return.controller.js';
import { authenticateToken, requireAdmin } from '../../../middleware/auth.js';

const router = Router();

// Public: Submit return request from consumer storefront (/returns/raise)
router.post('/', returnController.submitReturnRequest);

// Admin routes
router.get('/', authenticateToken, requireAdmin, returnController.listReturns);
router.get('/:id', authenticateToken, requireAdmin, returnController.getReturnDetails);
router.patch('/:id/status', authenticateToken, requireAdmin, returnController.updateReturnStatus);

export default router;
