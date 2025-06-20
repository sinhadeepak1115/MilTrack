"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const logController_1 = require("../controllers/logController");
const router = (0, express_1.Router)();
router.get("/", logController_1.getLogs).post("/", logController_1.createLogs);
router.put("/:id", logController_1.updateLogs).delete("/:id", logController_1.deleteLogs);
exports.default = router;
