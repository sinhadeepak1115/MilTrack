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
router
  .get("/", validateToken, getUsers)
  .get("/:id", validateToken, getUserById);

export default router;
