"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const assetController_1 = require("../controllers/assetController");
const router = (0, express_1.Router)();
router.get("/", assetController_1.getAsset).post("/", assetController_1.createAsset);
router.put("/:id", assetController_1.updateAsset).delete("/:id", assetController_1.deleteAsset);
exports.default = router;
