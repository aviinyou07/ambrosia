import { Request, Response } from 'express';
import * as orderQueries from '../queries/order.queries.js';
import { sendSuccess, sendError } from '../../../utils/response.js';

export const listOrders = async (req: Request, res: Response) => {
  try {
    const { status, search, limit, offset } = req.query;
    const orders = await orderQueries.getAllOrders(
      status ? String(status) : undefined,
      search ? String(search) : undefined,
      limit ? Number(limit) : 50,
      offset ? Number(offset) : 0
    );
    return sendSuccess(res, orders);
  } catch (error) {
    return sendError(res, 'Failed to fetch orders', 500, error);
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const order = await orderQueries.getOrderById(id);
    if (!order) {
      return sendError(res, 'Order not found', 404);
    }
    return sendSuccess(res, order);
  } catch (error) {
    return sendError(res, 'Failed to fetch order', 500, error);
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { items, ...orderData } = req.body;
    if (!items || !items.length || !orderData.customer_name || !orderData.customer_email) {
      return sendError(res, 'Order items and customer details are required', 400);
    }

    const created = await orderQueries.createOrder(orderData, items);
    return sendSuccess(res, created, 'Order placed successfully', 201);
  } catch (error) {
    return sendError(res, 'Failed to place order', 500, error);
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { status, tracking_carrier, tracking_number } = req.body;

    if (!status) {
      return sendError(res, 'Status is required', 400);
    }

    const updated = await orderQueries.updateOrderStatus(id, status, tracking_carrier, tracking_number);
    if (!updated) {
      return sendError(res, 'Order not found', 404);
    }
    return sendSuccess(res, updated, 'Order status updated successfully');
  } catch (error) {
    return sendError(res, 'Failed to update order status', 500, error);
  }
};
