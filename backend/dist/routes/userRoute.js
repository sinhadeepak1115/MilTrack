"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const validateTokenHandler_1 = __importDefault(require("../middleware/validateTokenHandler"));
const router = (0, express_1.Router)();
router.post("/register", userController_1.createUser).post("/login", userController_1.loginUser);
// validateToken middleware is applied to all routes below
router
    .get("/", validateTokenHandler_1.default, userController_1.getUsers)
    .get("/:id", validateTokenHandler_1.default, userController_1.getUserById);
router.delete("/:id", validateTokenHandler_1.default, userController_1.deleteUser);
exports.default = router;
