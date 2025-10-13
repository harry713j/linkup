import { Router } from "express";
import { authController } from "@/controllers/auth.controller.js";
import { verifyToken } from "@/middlewares/auth.middleware";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", verifyToken, authController.logout);
router.get("/refresh", authController.refresh);

export default router;
