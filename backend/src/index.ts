import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const PORT = process.env.PORT || 3000;

const prisma = new PrismaClient();

app.use(express.json());
app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    const user = await prisma.user.create({
      data: { username: username, password: password, role: "ADMIN" },
    });
    res.status(201).json(user);
    console.log(`User created: ${user.username} (${user.role})`);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT);
