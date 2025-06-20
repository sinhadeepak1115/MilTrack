import { Router } from "express";
import {
  getLogs,
  createLogs,
  updateLogs,
  deleteLogs,
} from "../controllers/logController";

const router = Router();

router.get("/", getLogs).post("/", createLogs);
router.put("/:id", updateLogs).delete("/:id", deleteLogs);

export default router;
