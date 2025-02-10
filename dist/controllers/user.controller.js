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
exports.GetUserInfo = exports.UpdateProfile = exports.UpdateProfilePicture = exports.DeleteAccount = exports.ResetPassword = exports.ForgotPassword = exports.updatepassword = exports.logout = exports.login = exports.registeruser = void 0;
const User_model_1 = __importDefault(require("../models/User.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const sendtoken_1 = __importDefault(require("../utils/sendtoken"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = require("../utils/nodemailer");
const cloudinary_1 = require("../utils/cloudinary");
const registeruser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const hashedpassword = yield bcryptjs_1.default.hash(password, 10);
        let user;
        if (req.file && req.file.path) {
            const cloudinary = yield (0, cloudinary_1.UploadOnCloudinary)(req.file.path);
            const profileurl = cloudinary === null || cloudinary === void 0 ? void 0 : cloudinary.secure_url;
            user = yield User_model_1.default.create({
                name,
                email,
                password: hashedpassword,
                profileurl,
            });
        }
        else {
            user = yield User_model_1.default.create({
                name,
                email,
                password: hashedpassword,
            });
        }
        const gettoken = yield (0, generateToken_1.default)(user);
        (0, sendtoken_1.default)(res, gettoken, 200, user);
    }
    catch (error) {
        next();
    }
});
exports.registeruser = registeruser;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorHandler_1.default(404, "please Enter valid email and password"));
        }
        const user = yield User_model_1.default.findOne({ email });
        if (!user) {
            return next(new ErrorHandler_1.default(404, "Invalid Credentials"));
        }
        const ismatched = yield bcryptjs_1.default.compare(password, user.password);
        if (!ismatched) {
            return next(new ErrorHandler_1.default(404, "Invalid Email or password"));
        }
        const gettoken = yield (0, generateToken_1.default)(user);
        (0, sendtoken_1.default)(res, gettoken, 200, user);
    }
    catch (error) {
        return next(error);
    }
});
exports.login = login;
function logout(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            res.cookie("token", null, {
                expires: new Date(0),
                httpOnly: true,
            });
            res.status(200).json({
                success: true,
                message: "Logged out successfully",
            });
        }
        catch (error) {
            next();
        }
    });
}
exports.logout = logout;
const updatepassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const user = yield User_model_1.default.findById(userId);
        if (!user) {
            return next(new ErrorHandler_1.default(404, "please login to continue"));
        }
        const { currentpassword, passwordToupdate } = req.body;
        const comparepassword = yield bcryptjs_1.default.compare(currentpassword, user.password);
        if (!comparepassword) {
            return next(new ErrorHandler_1.default(404, "Invalid current password"));
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const Hashedpassword = yield bcryptjs_1.default.hash(passwordToupdate, salt);
        user.password = Hashedpassword;
        yield user.save();
        const gettoken = yield (0, generateToken_1.default)(user);
        (0, sendtoken_1.default)(res, gettoken, 200, user);
    }
    catch (error) {
        next();
    }
});
exports.updatepassword = updatepassword;
const ForgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield User_model_1.default.findOne({ email });
        if (!user) {
            return next(new ErrorHandler_1.default(404, "user not found"));
        }
        const token = crypto_1.default.randomBytes(20).toString("hex");
        user.resetPasswordToken = token;
        user.resetPasswordTokenExpire = new Date(Date.now() + 3600000);
        yield user.save();
        yield (0, nodemailer_1.sendResetMail)(email, token);
        res.status(200).json({
            success: true,
            message: "Mail sent successfully",
        });
    }
    catch (error) {
        next();
    }
});
exports.ForgotPassword = ForgotPassword;
const ResetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const user = yield User_model_1.default.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpire: { $gt: new Date() },
        });
        if (!user) {
            return next(new ErrorHandler_1.default(404, "user not found"));
        }
        const Hashedpassword = yield bcryptjs_1.default.hash(password, 10);
        user.password = Hashedpassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpire = undefined;
        yield user.save();
        res.status(200).json({
            message: "successfully updated password",
        });
    }
    catch (error) {
        next();
    }
});
exports.ResetPassword = ResetPassword;
const DeleteAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const id = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id;
        const user = yield User_model_1.default.findById(id);
        if (!user) {
            return next(new ErrorHandler_1.default(404, "user not found"));
        }
        yield User_model_1.default.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            messaage: "successfully deleted your account",
        });
    }
    catch (error) {
        next();
    }
});
exports.DeleteAccount = DeleteAccount;
const UpdateProfilePicture = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const id = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id;
        if (!req.file || !req.file.path) {
            return next(new ErrorHandler_1.default(404, "Image Not Provided"));
        }
        const cloudinary = yield (0, cloudinary_1.UploadOnCloudinary)(req.file.path);
        const profileurl = cloudinary === null || cloudinary === void 0 ? void 0 : cloudinary.secure_url;
        const user = yield User_model_1.default.findByIdAndUpdate(id, {
            profileurl,
        });
        if (!user) {
            return next(new ErrorHandler_1.default(404, "User not updated "));
        }
        res.status(200).json({
            success: true,
            message: "Image changed successfully",
            user,
        });
    }
    catch (error) {
        console.log("this is a error:", error);
        next();
    }
});
exports.UpdateProfilePicture = UpdateProfilePicture;
const UpdateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const id = (_d = req.user) === null || _d === void 0 ? void 0 : _d._id;
        const user = yield User_model_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.status(200).json({
            success: true,
            message: "Updated your changes successfully",
            user,
        });
    }
    catch (error) {
        next();
    }
});
exports.UpdateProfile = UpdateProfile;
const GetUserInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const id = (_e = req.user) === null || _e === void 0 ? void 0 : _e._id;
        const user = yield User_model_1.default.findById(id);
        res.status(200).json({
            success: true,
            message: "Fetched user data successfully",
            user,
        });
    }
    catch (error) {
        next();
    }
});
exports.GetUserInfo = GetUserInfo;
