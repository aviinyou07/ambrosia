import { Request, Response } from 'express';
import * as customerQueries from '../queries/customer.queries.js';
import { sendSuccess, sendError } from '../../../utils/response.js';

export const listCustomers = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const customers = await customerQueries.getAllCustomers(search as string);
    return sendSuccess(res, customers);
  } catch (error) {
    return sendError(res, 'Failed to fetch customers', 500, error);
  }
};

export const getCustomerDetails = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const customer = await customerQueries.getCustomerById(id);
    if (!customer) {
      return sendError(res, 'Customer not found', 404);
    }
    return sendSuccess(res, customer);
  } catch (error) {
    return sendError(res, 'Failed to fetch customer profile', 500, error);
  }
};

export const updateRole = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { role } = req.body;
    if (!role || !['customer', 'admin'].includes(role)) {
      return sendError(res, 'Role must be either customer or admin', 400);
    }
    const updated = await customerQueries.updateCustomerRole(id, role);
    if (!updated) {
      return sendError(res, 'Customer not found', 404);
    }
    return sendSuccess(res, updated, 'Role updated successfully');
  } catch (error) {
    return sendError(res, 'Failed to update customer role', 500, error);
  }
};
