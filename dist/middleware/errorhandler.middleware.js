"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorhandlerMiddleware = void 0;
const ErrorhandlerMiddleware = (Error, req, res) => {
    const statusCode = Error.statuscode || 500;
    const message = Error.message || "Internal server error";
    res.status(statusCode).json({
        message,
    });
};
exports.ErrorhandlerMiddleware = ErrorhandlerMiddleware;
