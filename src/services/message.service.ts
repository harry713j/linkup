import { db } from "@/database/index.js";
import { messageRepo, messageStatusRepo } from "@/repos/message.repo.js";
import { userRepo } from "@/repos/auth.repo.js";
import { chatParticipantRepo, chatRepo } from "@/repos/chat.repo.js";
import { CreateMessageInput } from "@/validations/message.schema.js";
import { BadRequestError, UnauthorizedError } from "@/errors/ApiError.js";
import logger from "@/logging/logger.js";

async function create(userId: string, data: CreateMessageInput) {
  logger.debug(
    "Attempting to create a message in chat with chat id=" + data.chatId
  );
  const user = await userRepo.findByID(userId);
  if (!user) {
    logger.warn(
      `Message creation failed: No user found with user id=${userId}`
    );
    throw new UnauthorizedError();
  }

  const chat = await chatRepo.findOne(data.chatId);
  if (!chat) {
    logger.warn(
      `Message creation failed: No chat found with chat id=${userId}`
    );
    throw new BadRequestError("Chat not exists");
  }

  const participants = await chatParticipantRepo.findAll(chat.id);
  const participantIds = participants
    .map((p) => (p.user as any).id)
    .filter((id) => id !== user.id);

  const message = await db.transaction(async (tx) => {
    const message = await messageRepo.create(
      tx,
      chat.id,
      user.id,
      data.messageType,
      data.content,
      data.attachmentUrl
    );
    await messageStatusRepo.upsert(tx, message.id, "sent", ...participantIds);

    return message;
  });

  logger.info(
    `Message Created successfully with message id=${message.id} in chat with chat id=${chat.id}`
  );
  return message;
}

async function deleteMessage(
  userId: string,
  chatId: string,
  messageId: number
) {
  logger.debug("Attempting to delete a message in chat with chat id=" + chatId);
  const user = await userRepo.findByID(userId);
  if (!user) {
    logger.warn(
      `Message deletion failed: No user found with user id=${userId}`
    );
    throw new UnauthorizedError();
  }

  const chat = await chatRepo.findOne(chatId);
  if (!chat) {
    logger.warn(
      `Message deletion failed: No chat found with chat id=${userId}`
    );
    throw new BadRequestError("Chat not exists");
  }

  const result = await db.transaction(async (tx) => {
    const deleteRes = await messageRepo.deleteMessage(tx, chat.id, messageId);
    await messageStatusRepo.deleteAll(tx, deleteRes.deletedId);

    return deleteRes.deletedId;
  });

  logger.info(
    `Message deleted with message id=${messageId} from chat with chat id=${chatId}`
  );
  return result;
}

export const messageService = {
  create,
  deleteMessage,
};
