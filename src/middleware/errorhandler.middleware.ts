import { Request, Response, NextFunction } from "express";
import Errorhandler from "../utils/ErrorHandler";

export const ErrorhandlerMiddleware = (
  error: Errorhandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statuscode || 500;
  const message = error.message || "Internal server error";

  if (res.headersSent) {
    return next(error); // Delegate to the default error handler if headers are already sent
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
