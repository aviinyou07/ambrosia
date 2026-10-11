import { Request, Response } from 'express';
import * as productQueries from '../queries/product.queries.js';
import { sendSuccess, sendError } from '../../../utils/response.js';

export const listProducts = async (req: Request, res: Response) => {
  try {
    const { category, search, maxPrice, isFeatured, sortBy, limit, offset } = req.query;

    const filters: productQueries.ProductFilters = {
      categorySlug: category ? String(category) : undefined,
      search: search ? String(search) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      isFeatured: isFeatured !== undefined ? isFeatured === 'true' : undefined,
      sortBy: sortBy as any,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    };

    const products = await productQueries.getAllProducts(filters);
    return sendSuccess(res, products);
  } catch (error) {
    return sendError(res, 'Failed to fetch products', 500, error);
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const slug = String(req.params.slug);
    const product = await productQueries.getProductBySlug(slug);
    if (!product) {
      return sendError(res, 'Product not found', 404);
    }
    return sendSuccess(res, product);
  } catch (error) {
    return sendError(res, 'Failed to fetch product', 500, error);
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { title, slug, price, images, sizes, ...rest } = req.body;
    if (!title || !slug || !price) {
      return sendError(res, 'Title, slug, and price are required', 400);
    }

    const created = await productQueries.createProduct(
      { title, slug, price, ...rest },
      images || [],
      sizes || [
        { size: 'S', stock: 10 },
        { size: 'M', stock: 15 },
        { size: 'L', stock: 10 },
        { size: 'XL', stock: 5 },
      ]
    );

    return sendSuccess(res, created, 'Product created successfully', 201);
  } catch (error) {
    return sendError(res, 'Failed to create product', 500, error);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const updated = await productQueries.updateProduct(id, req.body);
    if (!updated) {
      return sendError(res, 'Product not found', 404);
    }
    return sendSuccess(res, updated, 'Product updated successfully');
  } catch (error) {
    return sendError(res, 'Failed to update product', 500, error);
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const deleted = await productQueries.deleteProduct(id);
    if (!deleted) {
      return sendError(res, 'Product not found', 404);
    }
    return sendSuccess(res, { id }, 'Product deleted successfully');
  } catch (error) {
    return sendError(res, 'Failed to delete product', 500, error);
  }
};
