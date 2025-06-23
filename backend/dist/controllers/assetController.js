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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAsset = exports.updateAsset = exports.createAsset = exports.getAsset = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAsset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const assets = yield prisma.asset.findMany({});
        res.status(200).json({ assets });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to retrieve assets" });
    }
});
exports.getAsset = getAsset;
const createAsset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, type, quantity, baseId } = req.body;
    if (!name || !type || quantity === undefined || !baseId) {
        res.status(400).json({
            error: "All fields (name, type, quantity, baseId) are required.",
        });
        return;
    }
    try {
        const asset = yield prisma.asset.create({
            data: {
                name: name,
                type: type,
                quantity: parseInt(quantity),
                baseId: parseInt(baseId),
            },
        });
        res.status(201).json(asset);
    }
    catch (error) {
        console.error("Asset creation error:", error.message);
        res.status(500).json({ error: "Asset creation failed." });
    }
});
exports.createAsset = createAsset;
const updateAsset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, type, quantity, baseId } = req.body;
    if (!id) {
        res.status(400).json({ error: "User ID is required" });
        return;
    }
    try {
        const updatedAsset = yield prisma.asset.update({
            where: { id: parseInt(id) },
            data: {
                name: name,
                type: type,
                quantity: parseInt(quantity),
                baseId: parseInt(baseId),
            },
        });
        res.status(200).json(updatedAsset);
    }
    catch (error) {
        res.status(500).json({ error: "Asset update failed" });
    }
});
exports.updateAsset = updateAsset;
const deleteAsset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: "Asset ID is required" });
        return;
    }
    try {
        const deletedAsset = yield prisma.asset.delete({
            where: { id: parseInt(id) },
        });
        res
            .status(200)
            .json({ message: "Asset deleted successfully", asset: deletedAsset });
    }
    catch (error) {
        res.status(500).json({ error: "Asset deletion failed" });
    }
});
exports.deleteAsset = deleteAsset;
