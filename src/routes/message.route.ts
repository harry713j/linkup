import { Router } from "express";
import { verifyToken } from "@/middlewares/auth.middleware.js";
import { validate } from "@/middlewares/validation.middleware.js";
import { messageController } from "@/controllers/message.controller.js";
import { deleteMessageSchema } from "@/validations/message.schema.js";

const router = Router();

router.delete(
  "/:messageId",
  verifyToken,
  validate(deleteMessageSchema),
  messageController.deleteMessage
);

export default router;
