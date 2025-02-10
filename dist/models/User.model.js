"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const validator_1 = __importDefault(require("validator"));
const userschema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (email) => validator_1.default.isEmail(email),
            message: "please Enter correct format of Email",
        },
    },
    password: {
        type: String,
        required: true,
        // minlength: ["please enter password greater than length 5"],
        // maxlength: 20,
    },
    role: {
        type: String,
        required: true,
        default: "user",
        enum: ["user", "admin"],
    },
    profileurl: {
        type: String,
    },
    currency: {
        type: String,
        default: "USD",
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordTokenExpire: {
        type: Date,
    },
});
const usermodel = (0, mongoose_1.model)("User", userschema);
exports.default = usermodel;
