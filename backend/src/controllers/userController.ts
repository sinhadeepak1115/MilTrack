import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "my-secret-key";

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

const createUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password, role, baseId } = req.body;

  if (!username || !password || !role) {
    res.status(400).json({
      error:
        "Please fill all the credentials like username, password, role and baseId ",
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role,
        baseId: parseInt(baseId),
      },
    });
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "10m" },
    );
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
  } catch (error: any) {
    console.error("Error creating user:", error);
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
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        baseId: user.baseId,
      },
      token,
    });
  } catch {
    res.status(500).json({ error: "User login failed" });
  }
};

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const deletedUser = await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      message: "User deleted successfully",
      user: deletedUser,
    });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "User deletion failed" });
  }
};

export { createUser, loginUser, getUsers, getUserById, deleteUser };
