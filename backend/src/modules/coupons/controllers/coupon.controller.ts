import { Request, Response } from 'express';
import * as couponQueries from '../queries/coupon.queries.js';
import { sendSuccess, sendError } from '../../../utils/response.js';

export const listCoupons = async (_req: Request, res: Response) => {
  try {
    const coupons = await couponQueries.getAllCoupons();
    return sendSuccess(res, coupons);
  } catch (error) {
    return sendError(res, 'Failed to fetch coupons', 500, error);
  }
};

export const validateCoupon = async (req: Request, res: Response) => {
  try {
    const { code, cartTotal = 0 } = req.body;
    if (!code) {
      return sendError(res, 'Coupon code is required', 400);
    }

    const coupon = await couponQueries.findCouponByCode(code);
    if (!coupon) {
      return sendError(res, 'Invalid coupon code', 404);
    }

    if (!coupon.is_active) {
      return sendError(res, 'This coupon is no longer active', 400);
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return sendError(res, 'This coupon has expired', 400);
    }

    if (coupon.usage_limit && coupon.times_used >= coupon.usage_limit) {
      return sendError(res, 'This coupon usage limit has been reached', 400);
    }

    const minOrder = parseFloat(coupon.min_order_value || '0');
    if (cartTotal < minOrder) {
      return sendError(res, `Minimum order value for this coupon is ₹${minOrder.toLocaleString('en-IN')}`, 400);
    }

    let discountAmount = 0;
    const discountVal = parseFloat(coupon.discount_value);
    if (coupon.discount_type === 'percentage') {
      discountAmount = Math.round((cartTotal * discountVal) / 100);
    } else {
      discountAmount = Math.min(discountVal, cartTotal);
    }

    return sendSuccess(res, {
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: discountVal,
      discountAmount,
      couponId: coupon.id,
    }, 'Coupon applied successfully');
  } catch (error) {
    return sendError(res, 'Failed to validate coupon', 500, error);
  }
};

export const createCoupon = async (req: Request, res: Response) => {
  try {
    const { code, discount_type, discount_value, min_order_value, usage_limit, expires_at } = req.body;
    if (!code || !discount_type || discount_value === undefined) {
      return sendError(res, 'Code, discount type, and discount value are required', 400);
    }

    const existing = await couponQueries.findCouponByCode(code);
    if (existing) {
      return sendError(res, `Coupon code '${code.toUpperCase()}' already exists`, 409);
    }

    const created = await couponQueries.createCoupon({
      code,
      discount_type,
      discount_value: Number(discount_value),
      min_order_value: min_order_value ? Number(min_order_value) : 0,
      usage_limit: usage_limit ? Number(usage_limit) : undefined,
      expires_at: expires_at || undefined,
    });

    return sendSuccess(res, created, 'Coupon created successfully', 201);
  } catch (error) {
    return sendError(res, 'Failed to create coupon', 500, error);
  }
};

export const toggleCouponStatus = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { is_active } = req.body;
    const updated = await couponQueries.toggleCouponStatus(id, Boolean(is_active));
    if (!updated) {
      return sendError(res, 'Coupon not found', 404);
    }
    return sendSuccess(res, updated, `Coupon ${updated.is_active ? 'activated' : 'deactivated'} successfully`);
  } catch (error) {
    return sendError(res, 'Failed to update coupon status', 500, error);
  }
};

export const deleteCoupon = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const deleted = await couponQueries.deleteCoupon(id);
    if (!deleted) {
      return sendError(res, 'Coupon not found', 404);
    }
    return sendSuccess(res, { id }, 'Coupon deleted successfully');
  } catch (error) {
    return sendError(res, 'Failed to delete coupon', 500, error);
  }
};
