import { Router } from 'express';
import * as customerController from '../controllers/customer.controller.js';
import { authenticateToken, requireAdmin } from '../../../middleware/auth.js';

const router = Router();

// All customer CRM routes are protected for admin
router.use(authenticateToken, requireAdmin);

router.get('/', customerController.listCustomers);
router.get('/:id', customerController.getCustomerDetails);
router.patch('/:id/role', customerController.updateRole);

export default router;
