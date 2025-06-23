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
exports.deleteLogs = exports.updateLogs = exports.createLogs = exports.getLogs = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getLogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        let logs;
        if (user.role === "ADMIN") {
            logs = yield prisma.log.findMany({});
        }
        else {
            logs = yield prisma.log.findMany({
                where: {
                    userId: user.userId, // userId from JWT
                },
            });
        }
        res.status(200).json({ logs });
    }
    catch (error) {
        console.error("Failed to retrieve logs:", error);
        res.status(500).json({ error: "Failed to retrieve logs" });
    }
});
exports.getLogs = getLogs;
const createLogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { action, quantity, assetId, userId, baseId, targetId, notes } = req.body;
    try {
        const log = yield prisma.log.create({
            data: {
                action: action,
                quantity: parseInt(quantity),
                assetId: parseInt(assetId),
                userId: parseInt(userId),
                baseId: parseInt(baseId),
                targetId: parseInt(targetId),
                notes: notes,
            },
        });
        res.status(201).json({ message: "Log created successfully", log });
    }
    catch (error) {
        if (error.code === "P2003") {
            console.error("Foreign key constraint failed:", error);
        }
        console.error("Error creating log:", error);
        res.status(500).json({ error: "Log creation failed" });
    }
});
exports.createLogs = createLogs;
const updateLogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { action, quantity, assetId, userId, baseId, targetId, notes } = req.body;
    try {
        const log = yield prisma.log.update({
            where: { id: parseInt(id) },
            data: {
                action: action,
                quantity: parseInt(quantity),
                assetId: parseInt(assetId),
                userId: parseInt(userId),
                baseId: parseInt(baseId),
                targetId: parseInt(targetId),
                notes: notes,
            },
        });
        res.status(201).json({ message: "Log updated successfully", log });
    }
    catch (error) {
        res.status(500).json({ error: "Log update failed" });
    }
});
exports.updateLogs = updateLogs;
const deleteLogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedLog = yield prisma.log.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({
            message: "Log deleted successfully",
            log: deletedLog,
        });
    }
    catch (error) {
        res.status(500).json({ error: "Log deletion failed" });
    }
});
exports.deleteLogs = deleteLogs;
