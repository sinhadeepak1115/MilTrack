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
  .get("/user", validateToken, getUsers)
  .get("/user/:id", validateToken, getUserById);

export default router;
