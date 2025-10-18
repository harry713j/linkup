import { chatParticipantRepo, chatRepo } from "@/repos/chat.repo.js";
import { userRepo } from "@/repos/auth.repo.js";
import { messageRepo } from "@/repos/message.repo.js";
import {
  CreateChatInput,
  UpdateChatInput,
  ParticipantIds,
} from "@/validations/chat.schema.js";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "@/errors/ApiError.js";
import { db } from "@/database/index.js";
import { Participant } from "@/types/chat";

async function createChat(userId: string, data: CreateChatInput) {
  const user = await userRepo.findByID(userId);
  if (!user) {
    throw new UnauthorizedError();
  }

  if (data.type === "direct") {
    if (
      data.participants.length != 2 ||
      data.name ||
      data.adminId ||
      data.groupIcon
    ) {
      throw new BadRequestError("Invalid data provided for direct chat");
    }

    const directChatName = `${data.participants[0]}-${data.participants[1]}`;
    data.name = directChatName;
  }

  const chatDetails = await db.transaction(async (tx) => {
    const chat = await chatRepo.create(
      tx,
      data.type,
      data.name as string,
      data.adminId,
      data.groupIcon
    );
    const participantValues: Participant[] = data.participants.map(
      (participant) => {
        const role =
          data.adminId && participant === data.adminId
            ? "admin"
            : "participant";
        return { participantID: participant, role: role };
      }
    );
    const participants = await chatParticipantRepo.create(
      tx,
      chat.id,
      ...participantValues
    );

    return { chat, participants };
  });

  return chatDetails;
}

async function updateChat(
  userId: string,
  chatId: string,
  data: UpdateChatInput
) {
  const user = await userRepo.findByID(userId);
  if (!user) {
    throw new UnauthorizedError();
  }

  const chat = await chatRepo.findOne(chatId);
  if (!chat) {
    throw new NotFoundError("Chat group not exists");
  }

  if (chat.adminID !== userId || chat.type === "direct") {
    throw new UnauthorizedError("You don't have permission to modify the chat");
  }

  const updatedChat = await chatRepo.update(
    chatId,
    data.name,
    data.groupIcon,
    data.adminId
  );
  return updatedChat;
}

async function fetchAllChats(userId: string) {
  const user = await userRepo.findByID(userId);
  if (!user) {
    throw new UnauthorizedError();
  }

  return await chatRepo.findAll(userId);
}

async function fetchChat(userId: string, chatId: string) {
  const user = await userRepo.findByID(userId);
  if (!user) {
    throw new UnauthorizedError();
  }

  return await chatRepo.findOne(chatId);
}

async function removeChat(userId: string, chatId: string) {
  const user = await userRepo.findByID(userId);
  if (!user) {
    throw new UnauthorizedError();
  }

  const chat = await chatRepo.findOne(chatId);
  if (!chat) {
    throw new NotFoundError("Chat not exists");
  }

  if (chat.type === "group" && chat.adminID !== user.id) {
    throw new UnauthorizedError("You don't have permission for delete");
  }

  return await chatRepo.deleteChat(chat.id);
}

async function fetchAllMessage(
  userId: string,
  chatId: string,
  page: number,
  limit: number
) {
  const user = await userRepo.findByID(userId);
  if (!user) {
    throw new UnauthorizedError();
  }

  const chat = await chatRepo.findOne(chatId);
  if (!chat) {
    throw new NotFoundError("Chat not exists");
  }

  const paginatedMessageResponse = await messageRepo.fetchAll(
    chat.id,
    page,
    limit
  );
  return paginatedMessageResponse;
}

async function addParticipants(
  userId: string,
  chatId: string,
  participantIds: ParticipantIds
) {
  const user = await userRepo.findByID(userId);
  if (!user) {
    throw new UnauthorizedError();
  }

  const chat = await chatRepo.findOne(chatId);
  if (!chat) {
    throw new NotFoundError("Chat not exists");
  }

  if (chat.type === "direct") {
    throw new BadRequestError("Can't add participants to a direct chat");
  }

  if (chat.adminID !== user.id) {
    throw new UnauthorizedError(
      "You don't have permission for add participants"
    );
  }

  const participantValues: Participant[] = participantIds.map((pId) => {
    return {
      participantID: pId,
      role: "participant",
    };
  });

  return await chatParticipantRepo.createParticipants(
    chat.id,
    ...participantValues
  );
}

async function removeParticipants(
  userId: string,
  chatId: string,
  participantId: string
) {
  const user = await userRepo.findByID(userId);
  if (!user) {
    throw new UnauthorizedError();
  }

  const chat = await chatRepo.findOne(chatId);
  if (!chat) {
    throw new NotFoundError("Chat not exists");
  }

  if (chat.type === "direct") {
    throw new BadRequestError("Can't remove participants from a direct chat");
  }

  if (chat.adminID !== user.id) {
    throw new UnauthorizedError(
      "You don't have permission for remove participants"
    );
  }

  return await chatParticipantRepo.delete(chat.id, participantId);
}

async function fetchAllParticipants(userId: string, chatId: string) {
  const user = await userRepo.findByID(userId);
  if (!user) {
    throw new UnauthorizedError();
  }

  const chat = await chatRepo.findOne(chatId);
  if (!chat) {
    throw new NotFoundError("Chat not exists");
  }

  return await chatParticipantRepo.findAll(chat.id);
}

export const chatService = {
  createChat,
  updateChat,
  fetchAllChats,
  fetchChat,
  removeChat,
  addParticipants,
  removeParticipants,
  fetchAllParticipants,
  fetchAllMessage,
};
