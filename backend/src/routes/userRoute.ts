import { Router } from "express";
import {
  createUser,
  loginUser,
  getUsers,
  getUserById,
} from "../controllers/userController";

const router = Router();

router.post("/register", createUser).post("/login", loginUser);
router.get("/user", getUsers).get("/user/:id", getUserById);

export default router;
