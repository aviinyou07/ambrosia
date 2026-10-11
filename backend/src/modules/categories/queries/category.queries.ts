import { query } from '../../../config/db.js';

export const getAllCategories = async () => {
  const sql = `
    SELECT c.*, COUNT(p.id)::int as product_count
    FROM categories c
    LEFT JOIN products p ON p.category_id = c.id AND p.is_active = true
    GROUP BY c.id
    ORDER BY c.display_order ASC, c.name ASC
  `;
  const result = await query(sql);
  return result.rows;
};

export const getCategoryBySlug = async (slug: string) => {
  const sql = `SELECT * FROM categories WHERE LOWER(slug) = LOWER($1) LIMIT 1`;
  const result = await query(sql, [slug.trim()]);
  return result.rows[0];
};

export const createCategory = async (data: { name: string; slug: string; description?: string; image_url?: string; display_order?: number }) => {
  const sql = `
    INSERT INTO categories (name, slug, description, image_url, display_order)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const result = await query(sql, [
    data.name,
    data.slug.trim().toLowerCase(),
    data.description || null,
    data.image_url || null,
    data.display_order || 0,
  ]);
  return result.rows[0];
};

export const updateCategory = async (id: string, data: { name?: string; slug?: string; description?: string; image_url?: string; display_order?: number }) => {
  const sql = `
    UPDATE categories
    SET 
      name = COALESCE($2, name),
      slug = COALESCE($3, slug),
      description = COALESCE($4, description),
      image_url = COALESCE($5, image_url),
      display_order = COALESCE($6, display_order)
    WHERE id = $1
    RETURNING *
  `;
  const result = await query(sql, [
    id,
    data.name || null,
    data.slug ? data.slug.trim().toLowerCase() : null,
    data.description || null,
    data.image_url || null,
    data.display_order ?? null,
  ]);
  return result.rows[0];
};

export const deleteCategory = async (id: string) => {
  const sql = `DELETE FROM categories WHERE id = $1 RETURNING id`;
  const result = await query(sql, [id]);
  return result.rows[0];
};
