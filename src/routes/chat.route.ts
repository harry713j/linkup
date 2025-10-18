import { Router } from "express";
import { validate } from "@/middlewares/validation.middleware";
import { verifyToken } from "@/middlewares/auth.middleware";
import { chatController } from "@/controllers/chat.controller.js";
import {
  chatSchema,
  updateChatSchema,
  addParticipantsSchema,
} from "@/validations/chat.schema.js";

const router = Router();

router
  .route("")
  .post(verifyToken, validate(chatSchema), chatController.createChat)
  .get(verifyToken, chatController.fetchAllChats);

router
  .route("/:chatId")
  .patch(verifyToken, validate(updateChatSchema), chatController.updateChat)
  .get(verifyToken, chatController.fetchChat)
  .delete(verifyToken, chatController.removeChat);

router
  .route("/:chatId/participants")
  .post(
    verifyToken,
    validate(addParticipantsSchema),
    chatController.addParticipants
  )
  .get(verifyToken, chatController.fetchAllParticipants);

router.delete(
  "/:chatId/participants/:participantsId",
  verifyToken,
  chatController.removeParticipants
);

router.get("/:chatId/messages", verifyToken, chatController.fetchAllMessage);

export default router;
