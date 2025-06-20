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
exports.deletebase = exports.updateBase = exports.createBase = exports.getBase = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getBase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const base = yield prisma.base.findMany({
            select: { id: true, name: true, location: true },
        });
        res.status(200).json({ base });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to retrieve base" });
    }
});
exports.getBase = getBase;
const createBase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, location } = req.body;
    try {
        const base = yield prisma.base.create({
            data: { name: name, location: location },
        });
        res.status(201).json({ message: "Base created successfully", base });
    }
    catch (error) {
        if (error.code === "P2002") {
            res.status(409).json({ error: "Base already exists" });
        }
        else {
            res.status(500).json({ error: "Base creation failed" });
        }
    }
});
exports.createBase = createBase;
const updateBase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, location } = req.body;
    if (!id) {
        res.status(400).json({ error: "User ID is required" });
        return;
    }
    try {
        const updatedBase = yield prisma.base.update({
            where: { id: parseInt(id) },
            data: { name: name, location: location },
        });
        console.log("Updated Base:", updatedBase);
        res
            .status(200)
            .json({ message: "Base updated successfully", base: updatedBase });
    }
    catch (error) {
        if (error.code === "P2002") {
            res.status(409).json({ error: "Base name must be unique" });
        }
        else {
            res.status(500).json({ error: "Base update failed" });
        }
    }
});
exports.updateBase = updateBase;
const deletebase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: "User ID is required" });
        return;
    }
    try {
        const deletedbase = yield prisma.base.delete({
            where: {
                id: parseInt(id),
            },
        });
        res
            .status(200)
            .json({ message: "Base deleted successfully", base: deletedbase });
    }
    catch (error) {
        res.status(500).json({ error: "Base deletion failed" });
    }
});
exports.deletebase = deletebase;
