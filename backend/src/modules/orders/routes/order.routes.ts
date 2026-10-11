import { Router } from 'express';
import * as orderController from '../controllers/order.controller.js';
import { authenticateToken, requireAdmin } from '../../../middleware/auth.js';

const router = Router();

router.get('/', authenticateToken, requireAdmin, orderController.listOrders);
router.get('/:id', orderController.getOrder);
router.post('/', orderController.createOrder);
router.patch('/:id/status', authenticateToken, requireAdmin, orderController.updateStatus);

export default router;
