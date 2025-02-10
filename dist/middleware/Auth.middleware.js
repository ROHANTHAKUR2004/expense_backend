"use strict";
// import { Request, NextFunction } from "express";
// import Errorhandler from "../utils/ErrorHandler";
// import jwt from "jsonwebtoken";
// import { Requestwithuser } from "../types/RequestWithUser ";
// import JwtDecodedUser from "../types/jwtDecodedUser";
// import {Iuser} from "../models/User.model"
// // Define a new interface that extends Request
// // export interface AuthenticatedRequest extends Request {
// //   user?: Iuser | null ;// Include user property in the request
// // }
// export interface RequestWithUser extends Request {
//   user?: Iuser | null;
// }
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_model_1 = __importDefault(require("../models/User.model"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const isAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = req.cookies.token || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]);
    if (!token) {
        return next(new ErrorHandler_1.default(404, "Please login to continue"));
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = yield User_model_1.default.findById(decoded.id);
        if (!user) {
            return next(new ErrorHandler_1.default(404, "User not found"));
        }
        req.user = user;
        next();
    }
    catch (error) {
        return next(new ErrorHandler_1.default(401, "Not authorized, token failed"));
    }
});
exports.isAuthenticated = isAuthenticated;
