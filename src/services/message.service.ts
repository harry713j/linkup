import { db } from "@/database/index.js";
import { messageRepo, messageStatusRepo } from "@/repos/message.repo.js";
import { userRepo } from "@/repos/auth.repo.js";
import { chatParticipantRepo, chatRepo } from "@/repos/chat.repo.js";
import { CreateMessageInput } from "@/validations/message.schema.js";
import { BadRequestError, UnauthorizedError } from "@/errors/ApiError.js";

async function create(userId: string, data: CreateMessageInput) {
  const user = await userRepo.findByID(userId);
  if (!user) {
    throw new UnauthorizedError();
  }

  const chat = await chatRepo.findOne(data.chatId);
  if (!chat) {
    throw new BadRequestError("Chat not exists");
  }

  const participants = await chatParticipantRepo.findAll(chat.id);
  const participantIds = participants
    .map((p) => (p.user as any).id)
    .filter((id) => id !== user.id);

  return await db.transaction(async (tx) => {
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
}

async function deleteMessage(
  userId: string,
  chatId: string,
  messageId: number
) {
  const user = await userRepo.findByID(userId);
  if (!user) {
    throw new UnauthorizedError();
  }

  const chat = await chatRepo.findOne(chatId);
  if (!chat) {
    throw new BadRequestError("Chat not exists");
  }

  return await db.transaction(async (tx) => {
    const deleteRes = await messageRepo.deleteMessage(tx, chat.id, messageId);
    await messageStatusRepo.deleteAll(tx, deleteRes.deletedId);

    return deleteRes.deletedId;
  });
}

export const messageService = {
  create,
  deleteMessage,
};
