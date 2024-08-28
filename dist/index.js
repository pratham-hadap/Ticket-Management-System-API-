"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const ticketRoutes_1 = __importDefault(require("./routes/ticketRoutes"));
const ticketHistoryRoutes_1 = __importDefault(require("./routes/ticketHistoryRoutes"));
const ticketAnalyticsRoutes_1 = __importDefault(require("./routes/ticketAnalyticsRoutes"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use('/api', userRoutes_1.default);
app.use('/api', authRoutes_1.default);
app.use('/api', ticketRoutes_1.default);
app.use('/api', ticketHistoryRoutes_1.default);
app.use('/api', ticketAnalyticsRoutes_1.default);
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
