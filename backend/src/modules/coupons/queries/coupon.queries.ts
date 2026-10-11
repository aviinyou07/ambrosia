import { query } from '../../../config/db.js';

export const getAllCoupons = async () => {
  const sql = `SELECT * FROM coupons ORDER BY created_at DESC`;
  const result = await query(sql);
  return result.rows;
};

export const findCouponByCode = async (code: string) => {
  const sql = `
    SELECT * FROM coupons 
    WHERE UPPER(code) = UPPER($1)
    LIMIT 1
  `;
  const result = await query(sql, [code.trim().toUpperCase()]);
  return result.rows[0];
};

export const createCoupon = async (data: {
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_value?: number;
  usage_limit?: number;
  expires_at?: string;
}) => {
  const sql = `
    INSERT INTO coupons (code, discount_type, discount_value, min_order_value, usage_limit, expires_at)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  const result = await query(sql, [
    data.code.trim().toUpperCase(),
    data.discount_type,
    data.discount_value,
    data.min_order_value || 0,
    data.usage_limit || null,
    data.expires_at || null,
  ]);
  return result.rows[0];
};

export const toggleCouponStatus = async (id: string, is_active: boolean) => {
  const sql = `
    UPDATE coupons 
    SET is_active = $2
    WHERE id = $1
    RETURNING *
  `;
  const result = await query(sql, [id, is_active]);
  return result.rows[0];
};

export const incrementCouponUsage = async (code: string) => {
  const sql = `
    UPDATE coupons 
    SET times_used = times_used + 1
    WHERE UPPER(code) = UPPER($1)
    RETURNING *
  `;
  const result = await query(sql, [code.trim().toUpperCase()]);
  return result.rows[0];
};

export const deleteCoupon = async (id: string) => {
  const sql = `DELETE FROM coupons WHERE id = $1 RETURNING id`;
  const result = await query(sql, [id]);
  return result.rows[0];
};
