import { query } from '../../../config/db.js';

export const getAllCustomers = async (search?: string) => {
  let sql = `
    SELECT 
      u.id,
      u.name,
      u.email,
      u.phone,
      u.role,
      u.created_at,
      COUNT(o.id)::int as total_orders,
      COALESCE(SUM(o.total), 0)::numeric as total_spent,
      MAX(o.created_at) as last_order_date
    FROM users u
    LEFT JOIN orders o ON o.user_id = u.id
  `;
  const params: any[] = [];

  if (search) {
    sql += ` WHERE (LOWER(u.name) LIKE LOWER($1) OR LOWER(u.email) LIKE LOWER($1) OR LOWER(COALESCE(u.phone, '')) LIKE LOWER($1))`;
    params.push(`%${search}%`);
  }

  sql += `
    GROUP BY u.id
    ORDER BY total_spent DESC, u.created_at DESC
  `;

  const result = await query(sql, params);
  return result.rows;
};

export const getCustomerById = async (id: string) => {
  const userSql = `
    SELECT id, name, email, phone, role, created_at
    FROM users
    WHERE id = $1
  `;
  const userRes = await query(userSql, [id]);
  const user = userRes.rows[0];
  if (!user) return null;

  const ordersSql = `
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
      ) as items
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    WHERE o.user_id = $1
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `;
  const ordersRes = await query(ordersSql, [id]);

  return {
    ...user,
    orders: ordersRes.rows,
  };
};

export const updateCustomerRole = async (id: string, role: string) => {
  const sql = `
    UPDATE users
    SET role = $2
    WHERE id = $1
    RETURNING id, name, email, phone, role, created_at
  `;
  const result = await query(sql, [id, role]);
  return result.rows[0];
};
