import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const app = express();
const PORT = process.env.PORT || 3000;

const prisma = new PrismaClient();

app.use(express.json());
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    //hashed password
    const hashedPassword = bcrypt.hashSync(password, 10);
    if (!username || !password) {
      res.status(400).json({ error: "Username and password are required" });
    }

    //create user
    const user = await prisma.user.create({
      data: { username: username, password: hashedPassword, role: "ADMIN" },
    });
    res.status(201).json(user);
    console.log(`User created: ${user.username} (${user.role})`);
  } catch (error) {
    console.error("Error creating user:", error);

    //handle duplicate username error
    //@ts-ignore
    if (error.code === "P2002") {
      res.status(409).json({ error: "Username already exists" });
    }
    res.status(500).json({ error: "User creation failed" });
  }
});

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT);
