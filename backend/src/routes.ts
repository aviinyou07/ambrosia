import { Router } from 'express';
import authRoutes from './modules/auth/routes/auth.routes.js';
import categoryRoutes from './modules/categories/routes/category.routes.js';
import productRoutes from './modules/products/routes/product.routes.js';
import orderRoutes from './modules/orders/routes/order.routes.js';
import inventoryRoutes from './modules/inventory/routes/inventory.routes.js';
import couponRoutes from './modules/coupons/routes/coupon.routes.js';
import returnRoutes from './modules/returns/routes/return.routes.js';
import customerRoutes from './modules/customers/routes/customer.routes.js';
import analyticsRoutes from './modules/analytics/routes/analytics.routes.js';
import mediaRoutes from './modules/media/routes/media.routes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/products', productRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/inventory', inventoryRoutes);
apiRouter.use('/coupons', couponRoutes);
apiRouter.use('/returns', returnRoutes);
apiRouter.use('/customers', customerRoutes);
apiRouter.use('/analytics', analyticsRoutes);
apiRouter.use('/media', mediaRoutes);

export default apiRouter;
