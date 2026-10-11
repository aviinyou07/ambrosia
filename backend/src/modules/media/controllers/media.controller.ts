import { Request, Response } from 'express';
import * as r2Service from '../services/r2.service.js';
import { sendSuccess, sendError } from '../../../utils/response.js';

export const uploadMedia = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return sendError(res, 'No file uploaded', 400);
    }

    const { originalname, buffer, mimetype } = req.file;
    const url = await r2Service.uploadToR2(buffer, originalname, mimetype);

    return sendSuccess(res, {
      url,
      filename: originalname,
      size: buffer.length,
      mimetype,
    }, 'File uploaded successfully', 201);
  } catch (error) {
    return sendError(res, 'Failed to upload media file', 500, error);
  }
};

export const getPresignedUrl = async (req: Request, res: Response) => {
  try {
    const { fileName, contentType } = req.query;
    if (!fileName || !contentType) {
      return sendError(res, 'fileName and contentType query parameters are required', 400);
    }

    const presigned = await r2Service.getR2PresignedUploadUrl(
      String(fileName),
      String(contentType)
    );
    return sendSuccess(res, presigned);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to generate presigned upload URL', 500);
  }
};

export const listMedia = async (_req: Request, res: Response) => {
  try {
    const files = await r2Service.listR2Files();
    return sendSuccess(res, files);
  } catch (error) {
    return sendError(res, 'Failed to list media files', 500, error);
  }
};
