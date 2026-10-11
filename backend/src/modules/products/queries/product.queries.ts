import { query, pool } from '../../../config/db.js';

export interface ProductFilters {
  categorySlug?: string;
  search?: string;
  maxPrice?: number;
  isFeatured?: boolean;
  sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'newest';
  limit?: number;
  offset?: number;
}

export const getAllProducts = async (filters: ProductFilters = {}) => {
  let whereClauses: string[] = ['p.is_active = true'];
  let values: any[] = [];
  let paramIndex = 1;

  if (filters.categorySlug && filters.categorySlug !== 'all') {
    if (filters.categorySlug === 'new-arrivals') {
      whereClauses.push(`p.tag = 'New arrival'`);
    } else if (filters.categorySlug === 'bestsellers') {
      whereClauses.push(`p.tag = 'Bestseller'`);
    } else if (filters.categorySlug === 'sale') {
      whereClauses.push(`(p.tag = 'Sale' OR p.discount_percentage >= 40)`);
    } else {
      whereClauses.push(`LOWER(c.slug) = LOWER($${paramIndex++})`);
      values.push(filters.categorySlug);
    }
  }

  if (filters.search) {
    whereClauses.push(`(LOWER(p.title) LIKE LOWER($${paramIndex}) OR LOWER(p.description) LIKE LOWER($${paramIndex}) OR LOWER(COALESCE(p.fabric, '')) LIKE LOWER($${paramIndex}))`);
    values.push(`%${filters.search}%`);
    paramIndex++;
  }

  if (filters.maxPrice) {
    whereClauses.push(`p.price <= $${paramIndex++}`);
    values.push(filters.maxPrice);
  }

  if (filters.isFeatured !== undefined) {
    whereClauses.push(`p.is_featured = $${paramIndex++}`);
    values.push(filters.isFeatured);
  }

  let orderBy = 'p.created_at DESC';
  if (filters.sortBy === 'price-asc') orderBy = 'p.price ASC';
  if (filters.sortBy === 'price-desc') orderBy = 'p.price DESC';
  if (filters.sortBy === 'newest') orderBy = 'p.created_at DESC';

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
  const limitSql = filters.limit ? `LIMIT ${filters.limit}` : '';
  const offsetSql = filters.offset ? `OFFSET ${filters.offset}` : '';

  const sql = `
    SELECT 
      p.*,
      c.name as category_name,
      c.slug as category_slug,
      COALESCE(
        json_agg(DISTINCT pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL),
        '[]'
      ) as images,
      COALESCE(
        json_agg(DISTINCT pv.size) FILTER (WHERE pv.size IS NOT NULL),
        '[]'
      ) as sizes,
      COALESCE(SUM(pv.stock_quantity), 0)::int as total_stock
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN product_images pi ON pi.product_id = p.id
    LEFT JOIN product_variants pv ON pv.product_id = p.id
    ${whereSql}
    GROUP BY p.id, c.name, c.slug
    ORDER BY ${orderBy}
    ${limitSql} ${offsetSql}
  `;

  const result = await query(sql, values);
  return result.rows;
};

export const getProductBySlug = async (slug: string) => {
  const sql = `
    SELECT 
      p.*,
      c.name as category_name,
      c.slug as category_slug,
      COALESCE(
        json_agg(DISTINCT jsonb_build_object('url', pi.image_url, 'order', pi.display_order)) FILTER (WHERE pi.image_url IS NOT NULL),
        '[]'
      ) as image_objects,
      COALESCE(
        json_agg(DISTINCT pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL),
        '[]'
      ) as images,
      COALESCE(
        json_agg(DISTINCT jsonb_build_object('id', pv.id, 'size', pv.size, 'stock', pv.stock_quantity, 'sku', pv.sku)) FILTER (WHERE pv.id IS NOT NULL),
        '[]'
      ) as variants,
      COALESCE(
        json_agg(DISTINCT pv.size) FILTER (WHERE pv.size IS NOT NULL),
        '[]'
      ) as sizes
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN product_images pi ON pi.product_id = p.id
    LEFT JOIN product_variants pv ON pv.product_id = p.id
    WHERE LOWER(p.slug) = LOWER($1)
    GROUP BY p.id, c.name, c.slug
    LIMIT 1
  `;
  const result = await query(sql, [slug.trim()]);
  return result.rows[0];
};

export const getProductById = async (id: string) => {
  const sql = `
    SELECT 
      p.*,
      c.name as category_name,
      c.slug as category_slug,
      COALESCE(json_agg(DISTINCT pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL), '[]') as images,
      COALESCE(
        json_agg(DISTINCT jsonb_build_object('id', pv.id, 'size', pv.size, 'stock', pv.stock_quantity, 'sku', pv.sku)) FILTER (WHERE pv.id IS NOT NULL),
        '[]'
      ) as variants
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN product_images pi ON pi.product_id = p.id
    LEFT JOIN product_variants pv ON pv.product_id = p.id
    WHERE p.id = $1
    GROUP BY p.id, c.name, c.slug
    LIMIT 1
  `;
  const result = await query(sql, [id]);
  return result.rows[0];
};

export const createProduct = async (productData: any, images: string[] = [], sizes: { size: string; stock: number }[] = []) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const insertProductSql = `
      INSERT INTO products (
        title, slug, category_id, price, original_price, discount_percentage,
        tag, description, material_and_care, shipping_and_returns,
        fabric, style, color, is_featured, is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `;

    const productRes = await client.query(insertProductSql, [
      productData.title,
      productData.slug.trim().toLowerCase(),
      productData.category_id || null,
      productData.price,
      productData.original_price || null,
      productData.discount_percentage || 0,
      productData.tag || null,
      productData.description || null,
      productData.material_and_care || null,
      productData.shipping_and_returns || null,
      productData.fabric || null,
      productData.style || null,
      productData.color || null,
      productData.is_featured || false,
      productData.is_active !== undefined ? productData.is_active : true,
    ]);

    const createdProduct = productRes.rows[0];

    // Insert Images
    for (let i = 0; i < images.length; i++) {
      await client.query(
        `INSERT INTO product_images (product_id, image_url, display_order) VALUES ($1, $2, $3)`,
        [createdProduct.id, images[i], i + 1]
      );
    }

    // Insert Variants
    for (const v of sizes) {
      const sku = `${createdProduct.slug.substring(0, 10).toUpperCase()}-${v.size}-${Date.now().toString().slice(-4)}`;
      await client.query(
        `INSERT INTO product_variants (product_id, size, stock_quantity, sku) VALUES ($1, $2, $3, $4)`,
        [createdProduct.id, v.size, v.stock || 10, sku]
      );
    }

    await client.query('COMMIT');
    return createdProduct;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const updateProduct = async (id: string, productData: any) => {
  const sql = `
    UPDATE products
    SET 
      title = COALESCE($2, title),
      slug = COALESCE($3, slug),
      category_id = COALESCE($4, category_id),
      price = COALESCE($5, price),
      original_price = COALESCE($6, original_price),
      discount_percentage = COALESCE($7, discount_percentage),
      tag = COALESCE($8, tag),
      description = COALESCE($9, description),
      material_and_care = COALESCE($10, material_and_care),
      fabric = COALESCE($11, fabric),
      style = COALESCE($12, style),
      is_featured = COALESCE($13, is_featured),
      is_active = COALESCE($14, is_active)
    WHERE id = $1
    RETURNING *
  `;
  const result = await query(sql, [
    id,
    productData.title || null,
    productData.slug ? productData.slug.trim().toLowerCase() : null,
    productData.category_id || null,
    productData.price ?? null,
    productData.original_price ?? null,
    productData.discount_percentage ?? null,
    productData.tag || null,
    productData.description || null,
    productData.material_and_care || null,
    productData.fabric || null,
    productData.style || null,
    productData.is_featured ?? null,
    productData.is_active ?? null,
  ]);
  return result.rows[0];
};

export const deleteProduct = async (id: string) => {
  const sql = `DELETE FROM products WHERE id = $1 RETURNING id`;
  const result = await query(sql, [id]);
  return result.rows[0];
};
