import { query } from '../../../config/db.js';

export const getDashboardKPIs = async () => {
  const sql = `
    SELECT
      (SELECT COALESCE(SUM(total), 0)::numeric FROM orders WHERE status != 'Cancelled') as total_revenue,
      (SELECT COUNT(*)::int FROM orders) as total_orders,
      (SELECT COUNT(*)::int FROM products WHERE is_active = true) as total_products,
      (SELECT COUNT(*)::int FROM users WHERE role = 'customer') as total_customers,
      (SELECT COUNT(*)::int FROM orders WHERE status IN ('Confirmed', 'Processing')) as pending_orders,
      (SELECT COUNT(*)::int FROM product_variants WHERE stock_quantity <= 5) as low_stock_items,
      (SELECT COUNT(*)::int FROM return_requests WHERE status = 'Pending') as pending_returns
  `;
  const result = await query(sql);
  return result.rows[0];
};

export const getRevenueTrend = async (days = 30) => {
  const sql = `
    SELECT 
      TO_CHAR(d.date, 'YYYY-MM-DD') as day,
      TO_CHAR(d.date, 'Mon DD') as formatted_day,
      COALESCE(SUM(o.total), 0)::numeric as revenue,
      COUNT(o.id)::int as orders_count
    FROM (
      SELECT CURRENT_DATE - i as date
      FROM generate_series(0, $1 - 1) as i
    ) d
    LEFT JOIN orders o ON DATE(o.created_at) = d.date AND o.status != 'Cancelled'
    GROUP BY d.date
    ORDER BY d.date ASC
  `;
  const result = await query(sql, [days]);
  return result.rows;
};

export const getOrderStatusBreakdown = async () => {
  const sql = `
    SELECT 
      status, 
      COUNT(*)::int as count,
      COALESCE(SUM(total), 0)::numeric as total_value
    FROM orders
    GROUP BY status
    ORDER BY count DESC
  `;
  const result = await query(sql);
  return result.rows;
};

export const getTopSellingProducts = async (limit = 5) => {
  const sql = `
    SELECT 
      oi.product_id,
      oi.product_title,
      oi.product_image,
      SUM(oi.quantity)::int as total_sold,
      SUM(oi.quantity * oi.unit_price)::numeric as total_revenue
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    WHERE o.status != 'Cancelled'
    GROUP BY oi.product_id, oi.product_title, oi.product_image
    ORDER BY total_sold DESC
    LIMIT $1
  `;
  const result = await query(sql, [limit]);
  return result.rows;
};

export const getRecentOrders = async (limit = 7) => {
  const sql = `
    SELECT 
      o.id,
      o.customer_name,
      o.customer_email,
      o.total,
      o.status,
      o.payment_method,
      o.payment_status,
      o.created_at,
      COUNT(oi.id)::int as item_count
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    GROUP BY o.id
    ORDER BY o.created_at DESC
    LIMIT $1
  `;
  const result = await query(sql, [limit]);
  return result.rows;
};
