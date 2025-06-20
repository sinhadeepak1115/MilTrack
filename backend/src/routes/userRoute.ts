import { Router } from "express";
import {
  createUser,
  loginUser,
  getUsers,
  getUserById,
} from "../controllers/userController";
import validateToken from "../middleware/validateTokenHandler";

const router = Router();

router.post("/register", createUser).post("/login", loginUser);
// validateToken middleware is applied to all routes below
router.get("/", getUsers).get("/:id", getUserById);

export default router;
