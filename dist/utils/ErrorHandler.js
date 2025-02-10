"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Errorhandler extends Error {
    constructor(statuscode, message) {
        super(message);
        this.statuscode = statuscode;
        this.message = message;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = Errorhandler;
