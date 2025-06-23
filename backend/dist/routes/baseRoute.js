"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const baseController_1 = require("../controllers/baseController");
const validateTokenHandler_1 = __importDefault(require("../middleware/validateTokenHandler"));
const requireAdmin_1 = require("../middleware/requireAdmin");
const router = express_1.default.Router();
// Apply auth + admin-only to each route
router.get("/", validateTokenHandler_1.default, requireAdmin_1.requireAdmin, baseController_1.getBase);
router.post("/", validateTokenHandler_1.default, requireAdmin_1.requireAdmin, baseController_1.createBase);
router.put("/:id", validateTokenHandler_1.default, requireAdmin_1.requireAdmin, baseController_1.updateBase);
router.delete("/:id", validateTokenHandler_1.default, requireAdmin_1.requireAdmin, baseController_1.deletebase);
exports.default = router;
