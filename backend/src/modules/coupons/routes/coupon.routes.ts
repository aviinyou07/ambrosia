import { Router } from 'express';
import * as couponController from '../controllers/coupon.controller.js';
import { authenticateToken, requireAdmin } from '../../../middleware/auth.js';

const router = Router();

// Public route to validate coupon at checkout
router.post('/validate', couponController.validateCoupon);

// Admin routes
router.get('/', authenticateToken, requireAdmin, couponController.listCoupons);
router.post('/', authenticateToken, requireAdmin, couponController.createCoupon);
router.patch('/:id/status', authenticateToken, requireAdmin, couponController.toggleCouponStatus);
router.delete('/:id', authenticateToken, requireAdmin, couponController.deleteCoupon);

export default router;
