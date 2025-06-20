import { Router } from "express";
import {
  getAsset,
  createAsset,
  updateAsset,
  deleteAsset,
} from "../controllers/assetController";

const router = Router();

router.get("/", getAsset).post("/", createAsset);
router.put("/:id", updateAsset).delete("/:id", deleteAsset);

export default router;
