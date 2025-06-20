import { Router } from "express";
import {
  getBase,
  createBase,
  updateBase,
  deletebase,
} from "../controllers/baseController";

const router = Router();

router.get("/", getBase).post("/", createBase);

router.put("/:id", updateBase).delete("/:id", deletebase);

export default router;
