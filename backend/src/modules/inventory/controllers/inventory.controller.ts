import { Request, Response } from 'express';
import * as inventoryQueries from '../queries/inventory.queries.js';
import { sendSuccess, sendError } from '../../../utils/response.js';

export const listInventory = async (req: Request, res: Response) => {
  try {
    const lowStock = req.query.lowStock === 'true';
    const inventory = await inventoryQueries.getInventoryList(lowStock);
    return sendSuccess(res, inventory);
  } catch (error) {
    return sendError(res, 'Failed to fetch inventory', 500, error);
  }
};

export const updateStock = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { quantity } = req.body;

    if (quantity === undefined || isNaN(Number(quantity))) {
      return sendError(res, 'Valid stock quantity is required', 400);
    }

    const updated = await inventoryQueries.updateVariantStock(id, Number(quantity));
    if (!updated) {
      return sendError(res, 'Variant not found', 404);
    }
    return sendSuccess(res, updated, 'Inventory stock updated successfully');
  } catch (error) {
    return sendError(res, 'Failed to update stock', 500, error);
  }
};
