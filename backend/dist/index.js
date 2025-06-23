"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const baseRoute_1 = __importDefault(require("./routes/baseRoute"));
const assetRoute_1 = __importDefault(require("./routes/assetRoute"));
const logRoutes_1 = __importDefault(require("./routes/logRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/user", userRoute_1.default);
app.use("/api/base", baseRoute_1.default);
app.use("/api/asset", assetRoute_1.default);
app.use("/api/logs", logRoutes_1.default);
app.get("/", (req, res) => {
    res.send("Hello from backend");
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
