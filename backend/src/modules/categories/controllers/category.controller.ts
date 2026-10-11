import { Request, Response } from 'express';
import * as categoryQueries from '../queries/category.queries.js';
import { sendSuccess, sendError } from '../../../utils/response.js';

export const listCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await categoryQueries.getAllCategories();
    return sendSuccess(res, categories);
  } catch (error) {
    return sendError(res, 'Failed to fetch categories', 500, error);
  }
};

export const getCategory = async (req: Request, res: Response) => {
  try {
    const slug = String(req.params.slug);
    const category = await categoryQueries.getCategoryBySlug(slug);
    if (!category) {
      return sendError(res, 'Category not found', 404);
    }
    return sendSuccess(res, category);
  } catch (error) {
    return sendError(res, 'Failed to fetch category', 500, error);
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, slug, description, image_url, display_order } = req.body;
    if (!name || !slug) {
      return sendError(res, 'Name and slug are required', 400);
    }

    const created = await categoryQueries.createCategory({
      name,
      slug,
      description,
      image_url,
      display_order,
    });
    return sendSuccess(res, created, 'Category created successfully', 201);
  } catch (error) {
    return sendError(res, 'Failed to create category', 500, error);
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const updated = await categoryQueries.updateCategory(id, req.body);
    if (!updated) {
      return sendError(res, 'Category not found', 404);
    }
    return sendSuccess(res, updated, 'Category updated successfully');
  } catch (error) {
    return sendError(res, 'Failed to update category', 500, error);
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const deleted = await categoryQueries.deleteCategory(id);
    if (!deleted) {
      return sendError(res, 'Category not found', 404);
    }
    return sendSuccess(res, { id }, 'Category deleted successfully');
  } catch (error) {
    return sendError(res, 'Failed to delete category', 500, error);
  }
};
