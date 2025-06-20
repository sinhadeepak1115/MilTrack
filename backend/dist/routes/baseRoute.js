"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const baseController_1 = require("../controllers/baseController");
const router = (0, express_1.Router)();
router.get("/", baseController_1.getBase).post("/", baseController_1.createBase);
router.put("/:id", baseController_1.updateBase).delete("/:id", baseController_1.deletebase);
exports.default = router;
