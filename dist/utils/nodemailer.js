"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const Transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    // service: process.env.SMPT_SERVICE,
    service: "yashpawar12122004@gmail.com",
    auth: {
        user: "yashpawar12122004@gmail.com",
        // user: process.env.SMPT_MAIL,
        pass: "nwxb yuwl uioz dzkc",
        // pass: 'yash1212204',
    },
});
const sendResetMail = (email, token) => {
    const resetLink = `https://expense-manager-frontend-nine.vercel.app/reset-password/${token}`;
    const mailOptions = {
        to: email,
        from: "passwordreset@yourapp.com",
        subject: "Password Reset",
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
           Please click on the following link, or paste this into your browser to complete the process:\n\n
           ${resetLink}\n\n
           If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };
    return Transporter.sendMail(mailOptions);
};
exports.sendResetMail = sendResetMail;
