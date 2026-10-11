import { query, pool } from '../../../config/db.js';

export const getAllOrders = async (status?: string, search?: string, limit = 50, offset = 0) => {
  let whereClauses: string[] = [];
  let values: any[] = [];
  let paramIndex = 1;

  if (status && status !== 'all') {
    whereClauses.push(`LOWER(o.status) = LOWER($${paramIndex++})`);
    values.push(status);
  }

  if (search) {
    whereClauses.push(`(LOWER(o.id) LIKE LOWER($${paramIndex}) OR LOWER(o.customer_name) LIKE LOWER($${paramIndex}) OR LOWER(o.customer_email) LIKE LOWER($${paramIndex}))`);
    values.push(`%${search}%`);
    paramIndex++;
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const sql = `
    SELECT 
      o.*,
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
      ) as items,
      COUNT(oi.id)::int as total_item_count
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    ${whereSql}
    GROUP BY o.id
    ORDER BY o.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  const result = await query(sql, values);
  return result.rows;
};

export const getOrderById = async (id: string) => {
  const sql = `
    SELECT 
      o.*,
      COALESCE(
        json_agg(
          jsonb_build_object(
            'id', oi.id,
            'product_id', oi.product_id,
            'title', oi.product_title,
            'image', oi.product_image,
            'size', oi.size,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price
          )
        ) FILTER (WHERE oi.id IS NOT NULL),
        '[]'
      ) as items
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    WHERE LOWER(o.id) = LOWER($1)
    GROUP BY o.id
    LIMIT 1
  `;
  const result = await query(sql, [id.trim()]);
  return result.rows[0];
};

export const createOrder = async (orderData: any, items: any[]) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const orderId = (orderData as any).id || `AVY-${Math.floor(10000 + Math.random() * 90000)}`;

    const insertOrderSql = `
      INSERT INTO orders (
        id, user_id, customer_name, customer_email, customer_phone,
        shipping_address, subtotal, discount, shipping_fee, total,
        status, payment_method, payment_status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;

    const orderRes = await client.query(insertOrderSql, [
      orderId,
      orderData.user_id || null,
      orderData.customer_name,
      orderData.customer_email,
      orderData.customer_phone,
      JSON.stringify(orderData.shipping_address),
      orderData.subtotal,
      orderData.discount || 0,
      orderData.shipping_fee || 0,
      orderData.total,
      'Confirmed',
      orderData.payment_method || 'UPI',
      orderData.payment_status || 'Paid',
    ]);

    const createdOrder = orderRes.rows[0];

    // Insert Items
    for (const it of items) {
      await client.query(`
        INSERT INTO order_items (order_id, product_id, product_title, product_image, size, quantity, unit_price)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        orderId,
        it.id || null,
        it.title,
        it.image || null,
        it.size,
        it.quantity,
        it.price,
      ]);

      // Deduct inventory stock if product exists
      if (it.id) {
        await client.query(`
          UPDATE product_variants 
          SET stock_quantity = GREATEST(0, stock_quantity - $1)
          WHERE product_id = $2 AND size = $3
        `, [it.quantity, it.id, it.size]);
      }
    }

    await client.query('COMMIT');
    return createdOrder;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const updateOrderStatus = async (
  id: string, 
  status: string, 
  trackingCarrier?: string, 
  trackingNumber?: string
) => {
  const sql = `
    UPDATE orders
    SET 
      status = $2,
      tracking_carrier = COALESCE($3, tracking_carrier),
      tracking_number = COALESCE($4, tracking_number)
    WHERE LOWER(id) = LOWER($1)
    RETURNING *
  `;
  const result = await query(sql, [id.trim(), status, trackingCarrier || null, trackingNumber || null]);
  return result.rows[0];
};
