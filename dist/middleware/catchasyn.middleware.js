"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Generic function to handle asynchronous errors with Express
const catchAsync = (fn) => ((req, res, next) => {
    fn(req, res, next)
        .catch((error) => {
        console.error(error); // Log the error for debugging
        // Handle the error here, send appropriate response to client
        res.status(500).json({ message: 'Internal Server Error' }); // Example error response
    });
});
exports.default = catchAsync;
