import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    let logs;
    if (user.role === "ADMIN") {
      logs = await prisma.log.findMany({});
    } else {
      logs = await prisma.log.findMany({
        where: {
          userId: user.userId, // userId from JWT
        },
      });
    }

    res.status(200).json({ logs });
  } catch (error) {
    console.error("Failed to retrieve logs:", error);
    res.status(500).json({ error: "Failed to retrieve logs" });
  }
};

const createLogs = async (req: Request, res: Response): Promise<void> => {
  const { action, quantity, assetId, userId, baseId, targetId, notes } =
    req.body;
  try {
    const log = await prisma.log.create({
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
  } catch (error: any) {
    if (error.code === "P2003") {
      console.error("Foreign key constraint failed:", error);
    }
    console.error("Error creating log:", error);
    res.status(500).json({ error: "Log creation failed" });
  }
};

const updateLogs = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { action, quantity, assetId, userId, baseId, targetId, notes } =
    req.body;
  try {
    const log = await prisma.log.update({
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
  } catch (error: any) {
    res.status(500).json({ error: "Log update failed" });
  }
};

const deleteLogs = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const deletedLog = await prisma.log.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({
      message: "Log deleted successfully",
      log: deletedLog,
    });
  } catch (error: any) {
    res.status(500).json({ error: "Log deletion failed" });
  }
};

export { getLogs, createLogs, updateLogs, deleteLogs };
