"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const logController_1 = require("../controllers/logController");
const validateTokenHandler_1 = __importDefault(require("../middleware/validateTokenHandler"));
const router = (0, express_1.Router)();
router.use(validateTokenHandler_1.default);
router.get("/", logController_1.getLogs).post("/", logController_1.createLogs);
router.put("/:id", logController_1.updateLogs).delete("/:id", logController_1.deleteLogs);
exports.default = router;
