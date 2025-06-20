import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getBase = async (req: Request, res: Response): Promise<void> => {
  try {
    const base = await prisma.base.findMany({
      select: { id: true, name: true, location: true },
    });
    res.status(200).json({ base });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve base" });
  }
};

const createBase = async (req: Request, res: Response): Promise<void> => {
  const { name, location } = req.body;
  try {
    const base = await prisma.base.create({
      data: { name: name, location: location },
    });
    res.status(201).json({ message: "Base created successfully", base });
  } catch (error: any) {
    if (error.code === "P2002") {
      res.status(409).json({ error: "Base already exists" });
    } else {
      res.status(500).json({ error: "Base creation failed" });
    }
  }
};

const updateBase = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, location } = req.body;
  if (!id) {
    res.status(400).json({ error: "User ID is required" });
    return;
  }
  try {
    const updatedBase = await prisma.base.update({
      where: { id: parseInt(id) },
      data: { name: name, location: location },
    });
    console.log("Updated Base:", updatedBase);
    res
      .status(200)
      .json({ message: "Base updated successfully", base: updatedBase });
  } catch (error: any) {
    if (error.code === "P2002") {
      res.status(409).json({ error: "Base name must be unique" });
    } else {
      res.status(500).json({ error: "Base update failed" });
    }
  }
};

const deletebase = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: "User ID is required" });
    return;
  }
  try {
    const deletedbase = await prisma.base.delete({
      where: {
        id: parseInt(id),
      },
    });
    res
      .status(200)
      .json({ message: "Base deleted successfully", base: deletedbase });
  } catch (error) {
    res.status(500).json({ error: "Base deletion failed" });
  }
};

export { getBase, createBase, updateBase, deletebase };
