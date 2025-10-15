import { Router } from "express";
import { verifyToken } from "@/middlewares/auth.middleware.js";
import { validate } from "@/middlewares/validation.middleware.js";
import {
  updateUserDetailSchema,
  updateEmailSchema,
  updatePasswordSchema,
  updateProfileUrl,
} from "@/validations/user.schema.js";
import { userController } from "@/controllers/user.controller.js";

const router = Router();

router.patch(
  "/me/email",
  verifyToken,
  validate(updateEmailSchema),
  userController.updateEmail
);
router.patch(
  "/me/password",
  verifyToken,
  validate(updatePasswordSchema),
  userController.updatePassword
);
router.patch(
  "/me",
  verifyToken,
  validate(updateUserDetailSchema),
  userController.update
);
router
  .route("/me/profile-picture")
  .post(
    verifyToken,
    validate(updateProfileUrl),
    userController.updateProfileUrl
  )
  .delete(verifyToken, userController.removeProfileUrl);

export default router;
