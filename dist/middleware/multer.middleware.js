"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = require("path");
// const __dirname = dirname(__filename);
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, (0, path_1.join)(__dirname, "temporary/"));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage });
exports.default = upload;
