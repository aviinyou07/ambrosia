import { Request, Response } from 'express';
import * as returnQueries from '../queries/return.queries.js';
import * as orderQueries from '../../orders/queries/order.queries.js';
import { sendSuccess, sendError } from '../../../utils/response.js';

export const listReturns = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const returns = await returnQueries.getAllReturns(status as string);
    return sendSuccess(res, returns);
  } catch (error) {
    return sendError(res, 'Failed to fetch return requests', 500, error);
  }
};

export const getReturnDetails = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const returnRequest = await returnQueries.getReturnById(id);
    if (!returnRequest) {
      return sendError(res, 'Return request not found', 404);
    }
    return sendSuccess(res, returnRequest);
  } catch (error) {
    return sendError(res, 'Failed to fetch return request details', 500, error);
  }
};

export const submitReturnRequest = async (req: Request, res: Response) => {
  try {
    const { order_id, customer_email, request_type, reason, comments } = req.body;
    if (!order_id || !customer_email || !request_type || !reason) {
      return sendError(res, 'Order ID, email, request type, and reason are required', 400);
    }

    // Verify order exists and matches email
    const order = await orderQueries.getOrderById(order_id);
    if (!order) {
      return sendError(res, `Order #${order_id} not found in our records`, 404);
    }

    if (order.customer_email.toLowerCase() !== customer_email.trim().toLowerCase()) {
      return sendError(res, `Provided email does not match order #${order_id}`, 400);
    }

    const created = await returnQueries.createReturnRequest({
      order_id,
      customer_email,
      request_type,
      reason,
      comments,
    });

    return sendSuccess(res, created, 'Return request submitted successfully', 201);
  } catch (error) {
    return sendError(res, 'Failed to submit return request', 500, error);
  }
};

export const updateReturnStatus = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { status } = req.body;
    const validStatuses = ['Pending', 'Approved', 'Rejected', 'Pickup Scheduled', 'Completed', 'Refunded'];
    if (!status || !validStatuses.includes(status)) {
      return sendError(res, `Status must be one of: ${validStatuses.join(', ')}`, 400);
    }

    const updated = await returnQueries.updateReturnStatus(id, status);
    if (!updated) {
      return sendError(res, 'Return request not found', 404);
    }

    return sendSuccess(res, updated, `Return status updated to ${status}`);
  } catch (error) {
    return sendError(res, 'Failed to update return status', 500, error);
  }
};
