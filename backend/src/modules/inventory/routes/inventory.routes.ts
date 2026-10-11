import { Router } from 'express';
import * as inventoryController from '../controllers/inventory.controller.js';
import { authenticateToken, requireAdmin } from '../../../middleware/auth.js';

const router = Router();

router.use(authenticateToken, requireAdmin);

router.get('/', inventoryController.listInventory);
router.patch('/:id', inventoryController.updateStock);

export default router;
