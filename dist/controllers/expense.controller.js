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
exports.getFullyearReport = exports.GetExpensesByDay = exports.Get_Expense_monthly_Graph = exports.getexpensebymonth = exports.getweeklyExpenseReportforGraph = exports.getExpenseByWeek = exports.getTotalexpense = exports.createExpense = void 0;
const Expense_model_1 = __importDefault(require("../models/Expense.model"));
const express_validator_1 = require("express-validator");
const catchasyn_middleware_1 = __importDefault(require("../middleware/catchasyn.middleware"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
exports.createExpense = (0, catchasyn_middleware_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            throw new ErrorHandler_1.default(400, "Validation failed: " +
                errors
                    .array()
                    .map((error) => error.msg)
                    .join(", "));
        }
        const userid = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const { amount, category, date, description, recurring, currency } = req.body;
        console.log("this is a req body:", req.body);
        const expense = yield Expense_model_1.default.create({
            userId: userid,
            amount,
            category,
            date,
            description,
            recurring,
            currency,
        });
        res.status(200).json({
            success: true,
            message: "expense created ",
            expense,
        });
    }
    catch (error) {
        res.status(200).json({
            success: false,
            message: "Internal server error ",
        });
    }
}));
exports.getTotalexpense = (0, catchasyn_middleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const user = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id;
        const { year } = req.body;
        if (!user) {
            return next(new ErrorHandler_1.default(404, "please login to continue "));
        }
        const startDate = new Date(year, 0, 1); // Start of the year
        const endDate = new Date(year, 11, 31); // End of the year
        const expenses = yield Expense_model_1.default.find({
            userId: user,
            date: { $gte: startDate, $lte: endDate },
        });
        let totalAmount = 0;
        expenses.forEach((expense) => {
            totalAmount += expense.amount;
        });
        res.status(200).json({
            success: true,
            message: "fetched your total expense ",
            Amount: totalAmount,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(500, "Internal server error"));
    }
}));
// export const getexpenseofprevousweek = catchAsync(
//   async (req: RequestWithUser, res: Response, next: NextFunction) => {
//     try {
//       const userid = req.user?._id;
//       const currentdate: Date = new Date();
//       const startofpreviousweek = new Date(
//         currentdate.getFullYear(),
//         currentdate.getMonth(),
//         currentdate.getDay() - 7
//       );
//       const endofpreviousweek = new Date(
//         currentdate.getFullYear(),
//         currentdate.getMonth(),
//         currentdate.getDay() - 1
//       );
//       const expenses = await Expense.find({
//         userId: userid,
//         date: { $gte: startofpreviousweek, $lte: endofpreviousweek },
//       });
//       if (!expenses) {
//         return next(new Errorhandler(404, "expense not found "));
//       }
//       let Toatlexpense: number = 0;
//       const expense_category: any = {};
//       expenses.forEach((expense) => {
//         if (!expense_category[expense.category]) {
//           expense_category[expense.category] = expense.amount;
//         } else {
//           expense_category[expense.category] += expense.amount;
//         }
//         Toatlexpense += expense.amount;
//       });
//       res.status(200).json({
//         success: true,
//         message: "fetched your previous week expense ",
//         category: expense_category,
//         Toatlexpense,
//         expenses,
//       });
//     } catch (error) {
//       return next(new Errorhandler(500, "Internal server error"));
//     }
//   }
// );
exports.getExpenseByWeek = (0, catchasyn_middleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e;
    try {
        const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id;
        const currentdate = new Date();
        const selectedWeekString = (_d = req.query.week) === null || _d === void 0 ? void 0 : _d.toString();
        const pagenumber = ((_e = req.query.page) === null || _e === void 0 ? void 0 : _e.toString()) || "1";
        if (!selectedWeekString) {
            return next(new ErrorHandler_1.default(400, "Missing 'week' query parameter."));
        }
        const selectedWeek = parseInt(selectedWeekString, 10);
        const page = parseInt(pagenumber);
        const skip = (page - 1) * 10;
        if (!selectedWeek || selectedWeek < 1 || selectedWeek > 3) {
            return next(new ErrorHandler_1.default(400, "Invalid week selection. Choose 1, 2, or 3."));
        }
        const offsetWeeks = selectedWeek - 1; // Calculate offset based on selected week
        const startofWeek = new Date(currentdate.getFullYear(), currentdate.getMonth(), currentdate.getDate() - (currentdate.getDay() || 7) - offsetWeeks * 7);
        startofWeek.setHours(0, 0, 0, 0); // Set start of week to midnight
        const endofWeek = new Date(startofWeek.getTime());
        endofWeek.setDate(endofWeek.getDate() + 6); // Set end of week to next Saturday night
        endofWeek.setHours(23, 59, 59, 999); // Set end of week to 11:59pm on Saturday
        const expenses = yield Expense_model_1.default.find({
            userId,
            date: { $gte: startofWeek, $lte: endofWeek },
        })
            .limit(10)
            .skip(skip);
        const totalexpensecounts = yield Expense_model_1.default.countDocuments({
            userId,
            date: { $gte: startofWeek, $lte: endofWeek },
        });
        const totalPages = Math.ceil(totalexpensecounts / 10);
        if (!expenses || expenses.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No expenses found for the selected week.",
                category: {},
                Toatlexpense: 0,
                expenses: [],
            });
        }
        let totalExpense = 0;
        const expenseCategory = {};
        expenses.forEach((expense) => {
            if (!expenseCategory[expense.category]) {
                expenseCategory[expense.category] = expense.amount;
            }
            else {
                expenseCategory[expense.category] += expense.amount;
            }
            totalExpense += expense.amount;
        });
        res.status(200).json({
            success: true,
            message: `Fetched your expenses for the previous ${selectedWeek} week(s).`,
            category: expenseCategory,
            totalExpense,
            totalPages,
            expenses,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(500, "Internal server error"));
    }
}));
exports.getweeklyExpenseReportforGraph = (0, catchasyn_middleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _f, _g;
    try {
        const userId = (_f = req.user) === null || _f === void 0 ? void 0 : _f._id;
        const currentdate = new Date();
        const selectedWeekString = (_g = req.query.week) === null || _g === void 0 ? void 0 : _g.toString();
        if (!selectedWeekString) {
            return next(new ErrorHandler_1.default(400, "Missing 'week' query parameter."));
        }
        const selectedWeek = parseInt(selectedWeekString, 10);
        if (!selectedWeek || selectedWeek < 1 || selectedWeek > 3) {
            return next(new ErrorHandler_1.default(400, "Invalid week selection. Choose 1, 2, or 3."));
        }
        const offsetWeeks = selectedWeek - 1; // Calculate offset based on selected week
        const startofWeek = new Date(currentdate.getFullYear(), currentdate.getMonth(), currentdate.getDate() - (currentdate.getDay() || 7) - offsetWeeks * 7);
        startofWeek.setHours(0, 0, 0, 0); // Set start of week to midnight
        const endofWeek = new Date(startofWeek.getTime());
        endofWeek.setDate(endofWeek.getDate() + 6); // Set end of week to next Saturday night
        endofWeek.setHours(23, 59, 59, 999);
        const Expenses = yield Expense_model_1.default.find({
            userId,
            date: { $gte: startofWeek, $lte: endofWeek },
        });
        if (!Expenses) {
            return next(new ErrorHandler_1.default(404, "Expenses Not Found"));
        }
        res.status(200).json({
            success: true,
            message: "fetched your weekly report ",
            Expenses,
        });
    }
    catch (error) {
        res.status(200).json({
            success: false,
            message: "Internal server error",
        });
    }
}));
exports.getexpensebymonth = (0, catchasyn_middleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _h, _j, _k, _l;
    try {
        const yeart = (_h = req.query.year) === null || _h === void 0 ? void 0 : _h.toString();
        const montht = (_j = req.query.month) === null || _j === void 0 ? void 0 : _j.toString();
        if (!montht || !yeart) {
            return next(new ErrorHandler_1.default(404, "please Select year and month"));
        }
        const month = parseInt(montht);
        const year = parseInt(yeart);
        //validation for years and month
        if (!year || !month || month < 1 || month > 12) {
            return next(new ErrorHandler_1.default(404, "Invalid Month or Year"));
        }
        const userid = (_k = req.user) === null || _k === void 0 ? void 0 : _k._id;
        const page = ((_l = req.query.page) === null || _l === void 0 ? void 0 : _l.toString()) || "1";
        const pagenumber = parseInt(page);
        const skip = (pagenumber - 1) * 10;
        const startdateofmonth = new Date(year, month - 1, 1);
        const enddateofmonth = new Date(year, month, 0);
        const expenses = yield Expense_model_1.default.find({
            userId: userid,
            date: { $gte: startdateofmonth, $lte: enddateofmonth },
        })
            .limit(10)
            .skip(skip);
        if (!expenses) {
            return next(new ErrorHandler_1.default(404, "expense not found "));
        }
        const Expenses = yield Expense_model_1.default.find({
            userId: userid,
            date: { $gte: startdateofmonth, $lte: enddateofmonth },
        });
        const Total_expense_count = yield Expense_model_1.default.countDocuments({
            userId: userid,
            date: { $gte: startdateofmonth, $lte: enddateofmonth },
        });
        const Totalpages = Math.ceil(Total_expense_count / 10);
        const expense_category = {};
        let totalexpense = 0;
        Expenses.forEach((expense) => {
            if (!expense_category[expense.category]) {
                expense_category[expense.category] = expense.amount;
            }
            else {
                expense_category[expense.category] += expense.amount;
            }
            totalexpense += expense.amount;
        });
        res.status(200).json({
            success: true,
            message: "fetched your monthly expense ",
            totalexpense,
            expense_category,
            expenses,
            Totalpages,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(500, "Internal server Error"));
    }
}));
exports.Get_Expense_monthly_Graph = (0, catchasyn_middleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _m, _o, _p;
    try {
        const yeart = (_m = req.query.year) === null || _m === void 0 ? void 0 : _m.toString();
        const montht = (_o = req.query.month) === null || _o === void 0 ? void 0 : _o.toString();
        if (!montht || !yeart) {
            return next(new ErrorHandler_1.default(404, "please Select year and month"));
        }
        const month = parseInt(montht);
        const year = parseInt(yeart);
        //validation for years and month
        if (!year || !month || month < 1 || month > 12) {
            return next(new ErrorHandler_1.default(404, "Invalid Month or Year"));
        }
        const userid = (_p = req.user) === null || _p === void 0 ? void 0 : _p._id;
        const startdateofmonth = new Date(year, month - 1, 1);
        const enddateofmonth = new Date(year, month, 0);
        const expenses = yield Expense_model_1.default.find({
            userId: userid,
            date: { $gte: startdateofmonth, $lte: enddateofmonth },
        });
        if (!expenses) {
            return next(new ErrorHandler_1.default(404, "expense not found "));
        }
        const expense_category = {};
        let totalexpense = 0;
        expenses.forEach((expense) => {
            if (!expense_category[expense.category]) {
                expense_category[expense.category] = expense.amount;
            }
            else {
                expense_category[expense.category] += expense.amount;
            }
            totalexpense += expense.amount;
        });
        res.status(200).json({
            success: true,
            message: "fetched your monthly expense ",
            totalexpense,
            expense_category,
            expenses,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(500, "Internal server Error"));
    }
}));
// export const getfullyearreport = catchAsync(
//   async (req: RequestWithUser, res: Response, next: NextFunction) => {
//     try {
//       const { year } = req.body;
//       if (!year) {
//         return next(new Errorhandler(404, "invalid year"));
//       }
//       let totalexpense = 0;
//       const yearlyExpensesByCategory: any = {};
//       const userId = req.user?._id;
//       // Iterate over each month of the year
//       for (let month = 0; month < 12; month++) {
//         // Calculate the start and end dates for the current month
//         const startDate = new Date(year, month, 1);
//         const endDate = new Date(year, month + 1, 0);
//         // Find all expenses for the user within the current month
//         const expenses = await Expense.find({
//           userId,
//           date: { $gte: startDate, $lte: endDate },
//         });
//         // Calculate total expenses by category for the current month
//         expenses.forEach((expense) => {
//           if (!yearlyExpensesByCategory[expense.category]) {
//             yearlyExpensesByCategory[expense.category][month] = Array(12).fill(0);
//           }
//           yearlyExpensesByCategory[expense.category][month] += expense.amount;
//           totalexpense += expense.amount;
//         });
//       }
//       res.status(200).json({
//         success: true,
//         message: "fetched your yearly details",
//         yearlyExpensesByCategory,
//         totalexpense,
//       });
//     } catch (error) {
//       return next(new Errorhandler(500, "internal server Error"));
//     }
//   }
// );
// export const getfullyearreport = catchAsync(
//   async (req: RequestWithUser, res: Response, next: NextFunction) => {
//     try {
//       const yeart = req.query.year;
//       if (!yeart) {
//         return next(new Errorhandler(404, "Invalid year"));
//       }
//       const year = parseInt(yeart.toString());
// console.log("this is year comes from frontend :",year);
//       let totalExpense = 0;
//       const yearlyExpensesByDay: {
//         [month: string]: { [day: number]: number };
//       } = {}; // Nested object for daily expenses
//       const userId = req.user?._id;
//       // Iterate over each month of the year
//       const monthNames = [
//         "January",
//         "February",
//         "March",
//         "April",
//         "May",
//         "June",
//         "July",
//         "August",
//         "September",
//         "October",
//         "November",
//         "December",
//       ]; // Month names array
//       for (let month = 0; month < 12; month++) {
//         // Calculate the start and end dates for the current month, handling leap year
//         const startDate = new Date(year, month, 1);
//         const endDate = new Date(year, month + 1, 0);
//         endDate.setDate(
//           endDate.getDate() +
//             (endDate.getMonth() === 1 && endDate.getDate() === 29 ? 1 : 0)
//         ); // Adjust for leap year in February
//         yearlyExpensesByDay[monthNames[month]] = {}; // Initialize empty object for the month
//         // Iterate over each day of the current month
//         for (let day = 1; day <= endDate.getDate(); day++) {
//           const dayStart = new Date(year, month, day);
//           const dayEnd = new Date(dayStart.getTime());
//           dayEnd.setDate(dayEnd.getDate() + 1); // Set end of day to next day at midnight
//           // Find expenses for the user within the current day
//           const expenses = await Expense.find({
//             userId,
//             date: { $gte: dayStart, $lte: dayEnd },
//           });
//           const dayTotal = expenses.reduce(
//             (acc, expense) => acc + expense.amount,
//             0
//           ); // Calculate daily total expense
//           yearlyExpensesByDay[monthNames[month]][day] = dayTotal; // Add daily expense to object
//         }
//       }
//       totalExpense = calculateTotalExpense(yearlyExpensesByDay); // Function to calculate total expense from nested object
//       res.status(200).json({
//         success: true,
//         message: "Fetched your yearly details",
//         yearlyExpensesByDay,
//         totalExpense,
//       });
//     } catch (error) {
//       return next(new Errorhandler(500, "Internal server error"));
//     }
//   }
// );
const GetExpensesByDay = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { date } = req.params;
        const expenses = yield Expense_model_1.default.find({ date });
        let TotalExpense = 0;
        expenses.forEach((expense) => {
            TotalExpense += expense.amount;
        });
        res.status(200).json({
            expenses,
            TotalExpense,
        });
    }
    catch (error) {
        next();
    }
});
exports.GetExpensesByDay = GetExpensesByDay;
exports.getFullyearReport = (0, catchasyn_middleware_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _q;
    try {
        const yeart = req.query.year;
        if (!yeart) {
            return next(new ErrorHandler_1.default(404, "Invalid year"));
        }
        const year = parseInt(yeart.toString());
        const userId = (_q = req.user) === null || _q === void 0 ? void 0 : _q._id;
        const startOfYear = new Date(year, 0, 1);
        const endOfYear = new Date(year, 11, 31, 23, 59, 59);
        // MongoDB aggregation pipeline
        const expenses = yield Expense_model_1.default.aggregate([
            {
                $match: {
                    userId,
                    date: {
                        $gte: startOfYear,
                        $lte: endOfYear,
                    },
                },
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$date" },
                        day: { $dayOfMonth: "$date" },
                    },
                    dailyTotal: { $sum: "$amount" },
                },
            },
            {
                $sort: { "_id.month": 1, "_id.day": 1 },
            },
        ]);
        const yearlyExpensesByDay = {};
        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        expenses.forEach((expense) => {
            const monthName = monthNames[expense._id.month - 1];
            if (!yearlyExpensesByDay[monthName]) {
                yearlyExpensesByDay[monthName] = {};
            }
            yearlyExpensesByDay[monthName][expense._id.day] = expense.dailyTotal;
        });
        const totalExpense = expenses.reduce((acc, expense) => acc + expense.dailyTotal, 0);
        res.status(200).json({
            success: true,
            message: "Fetched your yearly details",
            yearlyExpensesByDay,
            totalExpense,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(500, "Internal server error"));
    }
}));
// Function to calculate total expense from nested object (optional)
function calculateTotalExpense(yearlyExpensesByDay) {
    let total = 0;
    for (const month in yearlyExpensesByDay) {
        for (const day in yearlyExpensesByDay[month]) {
            total += yearlyExpensesByDay[month][day];
        }
    }
    return total;
}
