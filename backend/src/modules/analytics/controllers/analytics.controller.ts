import { Request, Response } from 'express';
import * as analyticsQueries from '../queries/analytics.queries.js';
import { sendSuccess, sendError } from '../../../utils/response.js';

export const getDashboardSummary = async (_req: Request, res: Response) => {
  try {
    const [kpis, revenueTrend, statusBreakdown, topProducts, recentOrders] = await Promise.all([
      analyticsQueries.getDashboardKPIs(),
      analyticsQueries.getRevenueTrend(30),
      analyticsQueries.getOrderStatusBreakdown(),
      analyticsQueries.getTopSellingProducts(5),
      analyticsQueries.getRecentOrders(7),
    ]);

    return sendSuccess(res, {
      kpis,
      revenueTrend,
      statusBreakdown,
      topProducts,
      recentOrders,
    });
  } catch (error) {
    return sendError(res, 'Failed to generate dashboard analytics', 500, error);
  }
};

export const getRevenueTrend = async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const trend = await analyticsQueries.getRevenueTrend(days);
    return sendSuccess(res, trend);
  } catch (error) {
    return sendError(res, 'Failed to fetch revenue trend', 500, error);
  }
};
