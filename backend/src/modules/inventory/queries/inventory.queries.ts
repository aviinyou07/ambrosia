import { query } from '../../../config/db.js';

export const getInventoryList = async (lowStockOnly = false) => {
  let where = '';
  if (lowStockOnly) {
    where = 'WHERE pv.stock_quantity <= 5';
  }

  const sql = `
    SELECT 
      pv.id as variant_id,
      pv.sku,
      pv.size,
      pv.stock_quantity,
      p.id as product_id,
      p.title as product_title,
      p.slug as product_slug,
      p.price as product_price,
      c.name as category_name,
      COALESCE(
        (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY display_order ASC LIMIT 1),
        '/images/ethnic_kurta_set_1789624822973.jpg'
      ) as product_image
    FROM product_variants pv
    JOIN products p ON p.id = pv.product_id
    LEFT JOIN categories c ON c.id = p.category_id
    ${where}
    ORDER BY pv.stock_quantity ASC, p.title ASC
  `;

  const result = await query(sql);
  return result.rows;
};

export const updateVariantStock = async (variantId: string, stockQuantity: number) => {
  const sql = `
    UPDATE product_variants
    SET stock_quantity = $2
    WHERE id = $1
    RETURNING *
  `;
  const result = await query(sql, [variantId, stockQuantity]);
  return result.rows[0];
};
