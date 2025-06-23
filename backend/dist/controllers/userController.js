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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getUserById = exports.getUsers = exports.loginUser = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "my-secret-key";
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user || user.role !== "ADMIN") {
        res.status(403).json({ error: "Access denied: Admins only" });
        return;
    }
    try {
        const users = yield prisma.user.findMany({
            select: { id: true, username: true, role: true },
        });
        res.status(200).json({ users });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to retrieve users" });
    }
});
exports.getUsers = getUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user || user.role !== "ADMIN") {
        res.status(403).json({ error: "Access denied: Admins only" });
        return;
    }
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ error: "User ID is required" });
        return;
    }
    try {
        const foundUser = yield prisma.user.findUnique({
            where: { id: parseInt(id) },
            select: { id: true, username: true, role: true },
        });
        if (!foundUser) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.status(200).json({ user: foundUser });
    }
    catch (_a) {
        res.status(500).json({ error: "Failed to retrieve user" });
    }
});
exports.getUserById = getUserById;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, role, baseId } = req.body;
    if (!username || !password || !role) {
        res.status(400).json({
            error: "Please fill all the credentials like username, password, role and baseId ",
        });
        return;
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    try {
        const user = yield prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                role,
                baseId: parseInt(baseId),
            },
        });
        const token = jsonwebtoken_1.default.sign({ userId: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "10m" });
        res.status(200).json({
            message: "Register successful",
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                baseId: user.baseId,
            },
            token,
        });
    }
    catch (error) {
        console.error("Error creating user:", error);
        if (error.code === "P2002") {
            res.status(409).json({ error: "User already exists" });
        }
        else {
            res.status(500).json({ error: "User creation failed" });
        }
    }
});
exports.createUser = createUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ error: "Username and password are required" });
        return;
    }
    try {
        const user = yield prisma.user.findUnique({ where: { username } });
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        const isValid = yield bcrypt_1.default.compare(password, user.password);
        // jwt logic
        const token = jsonwebtoken_1.default.sign({ userId: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: "10m" });
        if (!isValid) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                baseId: user.baseId,
            },
            token,
        });
    }
    catch (_a) {
        res.status(500).json({ error: "User login failed" });
    }
});
exports.loginUser = loginUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedUser = yield prisma.user.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({
            message: "User deleted successfully",
            user: deletedUser,
        });
    }
    catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "User deletion failed" });
    }
});
exports.deleteUser = deleteUser;
