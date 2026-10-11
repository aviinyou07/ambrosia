import { query } from '../../../config/db.js';

export const getAllReturns = async (status?: string) => {
  let sql = `
    SELECT 
      rr.*,
      o.customer_name,
      o.customer_phone,
      o.total as order_total,
      o.status as order_status
    FROM return_requests rr
    LEFT JOIN orders o ON o.id = rr.order_id
  `;
  const params: any[] = [];

  if (status && status !== 'all') {
    sql += ` WHERE LOWER(rr.status) = LOWER($1)`;
    params.push(status);
  }

  sql += ` ORDER BY rr.created_at DESC`;

  const result = await query(sql, params);
  return result.rows;
};

export const getReturnById = async (id: string) => {
  const sql = `
    SELECT 
      rr.*,
      o.customer_name,
      o.customer_phone,
      o.total as order_total,
      o.status as order_status,
      COALESCE(
        json_agg(
          jsonb_build_object(
            'id', oi.id,
            'title', oi.product_title,
            'image', oi.product_image,
            'size', oi.size,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price
          )
        ) FILTER (WHERE oi.id IS NOT NULL),
        '[]'
      ) as items
    FROM return_requests rr
    LEFT JOIN orders o ON o.id = rr.order_id
    LEFT JOIN order_items oi ON oi.order_id = rr.order_id
    WHERE rr.id = $1
    GROUP BY rr.id, o.customer_name, o.customer_phone, o.total, o.status
  `;
  const result = await query(sql, [id]);
  return result.rows[0];
};

export const createReturnRequest = async (data: {
  order_id: string;
  customer_email: string;
  request_type: string;
  reason: string;
  comments?: string;
}) => {
  const returnId = `RET-${Date.now().toString().slice(-6)}`;
  const sql = `
    INSERT INTO return_requests (id, order_id, customer_email, request_type, reason, comments, status)
    VALUES ($1, $2, $3, $4, $5, $6, 'Pending')
    RETURNING *
  `;
  const result = await query(sql, [
    returnId,
    data.order_id.trim().toUpperCase(),
    data.customer_email.trim().toLowerCase(),
    data.request_type,
    data.reason,
    data.comments || null,
  ]);
  return result.rows[0];
};

export const updateReturnStatus = async (id: string, status: string) => {
  const sql = `
    UPDATE return_requests
    SET status = $2
    WHERE id = $1
    RETURNING *
  `;
  const result = await query(sql, [id, status]);
  return result.rows[0];
};
