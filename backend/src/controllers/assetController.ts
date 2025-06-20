import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAsset = async (req: Request, res: Response): Promise<void> => {
  try {
    const assets = await prisma.asset.findMany({});
    res.status(200).json({ assets });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve assets" });
  }
};

const createAsset = async (req: Request, res: Response): Promise<void> => {
  const { name, type, quantity, baseId } = req.body;
  if (!name || !type || quantity === undefined || !baseId) {
    res.status(400).json({
      error: "All fields (name, type, quantity, baseId) are required.",
    });
    return;
  }
  try {
    const asset = await prisma.asset.create({
      data: {
        name: name,
        type: type,
        quantity: parseInt(quantity),
        baseId: parseInt(baseId),
      },
    });
    res.status(201).json(asset);
  } catch (error: any) {
    console.error("Asset creation error:", error.message);
    res.status(500).json({ error: "Asset creation failed." });
  }
};

const updateAsset = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, type, quantity, baseId } = req.body;
  if (!id) {
    res.status(400).json({ error: "User ID is required" });
    return;
  }
  try {
    const updatedAsset = await prisma.asset.update({
      where: { id: parseInt(id) },
      data: {
        name: name,
        type: type,
        quantity: parseInt(quantity),
        baseId: parseInt(baseId),
      },
    });
    res.status(200).json(updatedAsset);
  } catch (error: any) {
    res.status(500).json({ error: "Asset update failed" });
  }
};

const deleteAsset = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: "Asset ID is required" });
    return;
  }
  try {
    const deletedAsset = await prisma.asset.delete({
      where: { id: parseInt(id) },
    });
    res
      .status(200)
      .json({ message: "Asset deleted successfully", asset: deletedAsset });
  } catch (error: any) {
    res.status(500).json({ error: "Asset deletion failed" });
  }
};

export { getAsset, createAsset, updateAsset, deleteAsset };
