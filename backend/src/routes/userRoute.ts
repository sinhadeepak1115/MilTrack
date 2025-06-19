import { Router } from "express";
import { postUser } from "../controllers/userController";

const router = Router();

router.route("/register").post(postUser);

module.exports = router;
