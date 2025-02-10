"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const expenseSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String },
    recurring: { type: Boolean, default: false },
    currency: { type: String },
});
const expensemodel = (0, mongoose_1.model)("Expense", expenseSchema);
exports.default = expensemodel;
