import { Router } from 'express';
import * as productController from '../controllers/product.controller.js';
import { authenticateToken, requireAdmin } from '../../../middleware/auth.js';

const router = Router();

router.get('/', productController.listProducts);
router.get('/:slug', productController.getProduct);
router.post('/', authenticateToken, requireAdmin, productController.createProduct);
router.put('/:id', authenticateToken, requireAdmin, productController.updateProduct);
router.delete('/:id', authenticateToken, requireAdmin, productController.deleteProduct);

export default router;
