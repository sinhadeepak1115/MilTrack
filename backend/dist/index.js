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
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
app.post("/api/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        //hashed password
        const hashedPassword = bcrypt_1.default.hashSync(password, 10);
        if (!username || !password) {
            res.status(400).json({ error: "Username and password are required" });
        }
        //create user
        const user = yield prisma.user.create({
            data: { username: username, password: hashedPassword, role: "ADMIN" },
        });
        res.status(201).json(user);
        console.log(`User created: ${user.username} (${user.role})`);
    }
    catch (error) {
        console.error("Error creating user:", error);
        //handle duplicate username error
        //@ts-ignore
        if (error.code === "P2002") {
            res.status(409).json({ error: "Username already exists" });
        }
        res.status(500).json({ error: "User creation failed" });
    }
}));
app.get("/", (req, res) => {
    res.send("Hello, World!");
});
app.listen(PORT);
