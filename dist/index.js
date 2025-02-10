"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const serverconfig_1 = __importDefault(require("./config/serverconfig"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const expense_routes_1 = __importDefault(require("./routes/expense.routes"));
const databaseconfig_1 = __importDefault(require("./config/databaseconfig"));
const Budget_routes_1 = __importDefault(require("./routes/Budget.routes"));
const errorhandler_middleware_1 = require("./middleware/errorhandler.middleware");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        "https://expense-manager-frontend-nine.vercel.app",
        "http://localhost:5173",
    ],
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
(0, databaseconfig_1.default)();
app.use("/user", user_routes_1.default);
app.use("/expense", expense_routes_1.default);
app.use("/budget", Budget_routes_1.default);
app.use(errorhandler_middleware_1.ErrorhandlerMiddleware);
app.listen(serverconfig_1.default.PORT, () => {
    console.log(`server is running on port :${serverconfig_1.default.PORT}`);
});
