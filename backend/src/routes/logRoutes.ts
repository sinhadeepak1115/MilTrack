import { Router } from "express";
import {
  getLogs,
  createLogs,
  updateLogs,
  deleteLogs,
} from "../controllers/logController";
import validateToken from "../middleware/validateTokenHandler";

const router = Router();
router.use(validateToken);

router.get("/", getLogs).post("/", createLogs);
router.put("/:id", updateLogs).delete("/:id", deleteLogs);

export default router;
