import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "my-secret-key";

const createUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: "Username and password are required" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { username, password: hashedPassword, role },
    });
    res.status(201).json(user);
  } catch (error: any) {
    if (error.code === "P2002") {
      res.status(409).json({ error: "User already exists" });
    } else {
      res.status(500).json({ error: "User creation failed" });
    }
  }
};

const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: "Username and password are required" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);
    // jwt logic
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "10m" },
    );

    if (!isValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    res.status(200).json({
      message: "Login successful",
      user: { id: user.id, username: user.username, role: user.role },
      token,
    });
  } catch {
    res.status(500).json({ error: "User login failed" });
  }
};

const getUsers = async (req: Request, res: Response): Promise<void> => {
  const user = (req as any).user;

  if (!user || user.role !== "ADMIN") {
    res.status(403).json({ error: "Access denied: Admins only" });
    return;
  }

  try {
    const users = await prisma.user.findMany({
      select: { id: true, username: true, role: true },
    });
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve users" });
  }
};

const getUserById = async (req: Request, res: Response): Promise<void> => {
  const user = (req as any).user;

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
    const foundUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: { id: true, username: true, role: true },
    });

    if (!foundUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({ user: foundUser });
  } catch {
    res.status(500).json({ error: "Failed to retrieve user" });
  }
};

export { createUser, loginUser, getUsers, getUserById };
