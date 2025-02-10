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
const mongoose_1 = __importDefault(require("mongoose"));
const uri = "mongodb+srv://rohanthakur89768:dvLTfVxMiUI43sgT@cluster0.cxmlf.mongodb.net/";
function connectDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield mongoose_1.default.connect("mongodb+srv://rohanthakur89768:dvLTfVxMiUI43sgT@cluster0.cxmlf.mongodb.net/");
            console.log(`database is connected with :${response.connection.host}`);
        }
        catch (error) {
            console.log(`failed to connect with database !`);
            process.exit(1);
        }
    });
}
exports.default = connectDatabase;
