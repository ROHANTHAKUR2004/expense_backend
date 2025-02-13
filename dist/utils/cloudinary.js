"use strict";
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
exports.UploadOnCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
cloudinary_1.v2.config({
    cloud_name: "duzmyzmpa",
    api_key: "667322765163825",
    api_secret: "3vbirFk2VL-InUpDy7BMdpPdRdk",
});
const UploadOnCloudinary = (localpath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (localpath) {
            const res = yield cloudinary_1.v2.uploader.upload(localpath, {
                resource_type: "auto",
            });
            fs_1.default.unlinkSync(localpath);
            return res;
        }
        else {
            fs_1.default.unlinkSync(localpath);
            return null;
        }
    }
    catch (error) {
        return null;
    }
});
exports.UploadOnCloudinary = UploadOnCloudinary;
