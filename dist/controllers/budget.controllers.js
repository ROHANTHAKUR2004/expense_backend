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
exports.Getyourbudgets = exports.generatemonthlyReport = exports.deletebudget = exports.updatebudget = exports.createbudget = void 0;
const Budget_model_1 = __importDefault(require("../models/Budget.model"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const Expense_model_1 = __importDefault(require("../models/Expense.model"));
const createbudget = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const { category, month, year } = req.body;
        const existingbudget = yield Budget_model_1.default.find({ category, month, year });
        if (existingbudget.length !== 0) {
            return next(new ErrorHandler_1.default(400, "Budget already exists for this category and month you can update it now "));
        }
        const budget = yield Budget_model_1.default.create(Object.assign({ userId }, req.body));
        res.status(200).json({
            success: true,
            message: "created your budget successfully",
            budget,
        });
    }
    catch (error) {
        next();
    }
});
exports.createbudget = createbudget;
const updatebudget = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const updates = req.body;
        const updatedBudget = yield Budget_model_1.default.findByIdAndUpdate(id, updates, {
            new: true, // return the updated document
        });
        if (!updatedBudget) {
            return res.status(404).json({ message: "Budget not found" });
        }
        res.status(200).json({
            success: true,
            message: "updated successfully",
            updatebudget: exports.updatebudget,
        });
    }
    catch (error) {
        next();
    }
});
exports.updatebudget = updatebudget;
// export const getBudget =
//   async (req: RequestWithUser, res: Response, next: NextFunction) => {
//     try {
//       const userId = req.user?._id;
//       const { month, year } = req.query;
//       const budget = await Budget.findOne({ userId, month, year });
//       if (!budget) {
//         return next(new Errorhandler(404, "Budget not found"));
//       }
//       res.status(200).json({
//         success: true,
//         budget,
//       });
//     } catch (error) {
//       return next(new Errorhandler(500, "Internal server error"));
//     }
//   }
// );
const deletebudget = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        let budget = yield Budget_model_1.default.findById(id);
        if (!budget) {
            return next(new ErrorHandler_1.default(404, "your budget not found "));
        }
        budget = yield Budget_model_1.default.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "your budget deleted successfully",
        });
    }
    catch (error) {
        next();
    }
});
exports.deletebudget = deletebudget;
const generatemonthlyReport = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id;
        const { month, year, category } = req.body;
        let budgetquery = { userId, month, year, category };
        let expensequery = {
            userId,
            date: {
                $gte: new Date(year, month - 1, 1),
                $lte: new Date(year, month, 0),
            },
            category,
        };
        console.log(`this is budget querry:`, budgetquery);
        console.log(`this is expense query:`, expensequery);
        const expenses = yield Expense_model_1.default.find(expensequery);
        const budgets = yield Budget_model_1.default.findOne(budgetquery);
        console.log(`this is expenses :`, expenses);
        console.log(`this is budgets:`, budgets);
        if (!budgets || !expenses) {
            return next(new ErrorHandler_1.default(404, "expense or budget is not exist for this query"));
        }
        let budgetlimit = budgets.limit;
        let totalexpense = 0;
        // const expensebycategory: { [key: string]: number } = {};
        expenses.forEach((expense) => {
            totalexpense += expense.amount;
            // if (!expensebycategory[expense.category]) {
            //   expensebycategory[expense.category] = expense.amount;
            // } else {
            //   expensebycategory[expense.category] += expense.amount;
            // }
        });
        const percentageUsage = (totalexpense / budgetlimit) * 100;
        res.status(200).json({
            success: true,
            message: "successfully",
            budgetlimit,
            remainingbudget: budgetlimit - totalexpense,
            percentageUsage,
        });
    }
    catch (error) {
        console.log("this is a error:", error);
        next();
    }
});
exports.generatemonthlyReport = generatemonthlyReport;
const Getyourbudgets = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id;
        const page = req.query.page;
        if (!page) {
            return next(new ErrorHandler_1.default(404, "page not found please enter page "));
        }
        const pagenumber = parseInt(page.toString() || "1");
        const skip = (pagenumber - 1) * 10;
        // we have limit of 10 documents only
        const Budgets = yield Budget_model_1.default.find({ userId }).limit(10).skip(skip);
        if (!Budgets) {
            return next(new ErrorHandler_1.default(404, "budgets not found "));
        }
        const countofBudgets = yield Budget_model_1.default.countDocuments({ userId });
        const Totalpages = Math.ceil(countofBudgets / 10);
        res.status(200).json({
            success: true,
            message: "Fetched your budgets successfully",
            Budgets,
            Totalpages,
        });
    }
    catch (error) {
        next();
    }
});
exports.Getyourbudgets = Getyourbudgets;
