import { Router } from "express";
import { authController } from "@/controllers/auth.controller.js";
import { verifyToken } from "@/middlewares/auth.middleware.js";
import { validate } from "@/middlewares/validation.middleware.js";
import { registerSchema, loginSchema } from "@/validations/auth.schema.js";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.get("/logout", verifyToken, authController.logout);
router.get("/refresh", authController.refresh);

export default router;
