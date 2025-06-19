import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const postUser = async (req: Request, res: Response) => {
  const { username, password, role } = req.body;
  try {
    if (!username || !password) {
      res.status(400).json({ error: "Username and password are required" });
    }

    //hashed password
    const hashedPassword = bcrypt.hashSync(password, 10);

    //create user
    const user = await prisma.user.create({
      data: { username: username, password: hashedPassword, role: role },
    });

    console.log(`User created: ${user.id} ${user.username} ${user.role}`);
    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);

    //handle duplicate username error
    //@ts-ignore
    if (error.code === "P2002") {
      res.status(409).json({ error: "Username already exists" });
    }
    res.status(500).json({ error: "User creation failed" });
  }
};

export { postUser };
