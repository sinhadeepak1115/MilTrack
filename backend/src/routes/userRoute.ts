import { Router } from "express";
import {
  createUser,
  loginUser,
  getUsers,
  getUserById,
  deleteUser,
} from "../controllers/userController";
import validateToken from "../middleware/validateTokenHandler";

const router = Router();

router.post("/register", createUser).post("/login", loginUser);
// validateToken middleware is applied to all routes below
router
  .get("/", validateToken, getUsers)
  .get("/:id", validateToken, getUserById);

router.delete("/:id", validateToken, deleteUser);

export default router;
