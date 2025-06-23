import express from "express";
import {
  getBase,
  createBase,
  updateBase,
  deletebase,
} from "../controllers/baseController";
import validateToken from "../middleware/validateTokenHandler";
import { requireAdmin } from "../middleware/requireAdmin";

const router = express.Router();

// Apply auth + admin-only to each route
router.get("/", validateToken, requireAdmin, getBase);
router.post("/", validateToken, requireAdmin, createBase);
router.put("/:id", validateToken, requireAdmin, updateBase);
router.delete("/:id", validateToken, requireAdmin, deletebase);

export default router;
