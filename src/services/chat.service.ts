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
import logger from "@/logging/logger.js";

async function createChat(userId: string, data: CreateChatInput) {
  logger.debug(`Attempting to create a chat`);
  const user = await userRepo.findByID(userId);
  if (!user) {
    logger.warn(`Chat creation failed: No user found with user id=${userId}`);
    throw new UnauthorizedError();
  }

  if (data.type === "direct") {
    if (
      data.participants.length != 2 ||
      data.name ||
      data.adminId ||
      data.groupIcon
    ) {
      logger.warn(`Chat creation failed: Invalid data for direct chat`);
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

  logger.info(`Chat created successfully with chat id=${chatDetails.chat.id}`);
  return chatDetails;
}

async function updateChat(
  userId: string,
  chatId: string,
  data: UpdateChatInput
) {
  logger.debug(`Attempting to create a chat`);
  const user = await userRepo.findByID(userId);
  if (!user) {
    logger.warn(`Chat update failed: No user found with user id=${userId}`);
    throw new UnauthorizedError();
  }

  const chat = await chatRepo.findOne(chatId);
  if (!chat) {
    logger.warn(`Chat update failed: No chat found with chat id=${chatId}`);
    throw new NotFoundError("Chat group not exists");
  }

  if (chat.adminID !== userId || chat.type === "direct") {
    logger.warn(
      `Chat update failed: user with id=${userId} can't modify the chat`
    );
    throw new UnauthorizedError("You don't have permission to modify the chat");
  }

  const updatedChat = await chatRepo.update(
    chatId,
    data.name,
    data.groupIcon,
    data.adminId
  );

  logger.info(`Chat updated successful with chat id=${chatId}`);
  return updatedChat;
}

async function fetchAllChats(userId: string) {
  logger.debug(`Attempting to retrieve all chats of user id=${userId}`);
  const user = await userRepo.findByID(userId);
  if (!user) {
    logger.warn(`Chat retrieval failed: No user found with user id=${userId}`);
    throw new UnauthorizedError();
  }

  const groupChats = await chatRepo.findAllGroups(userId);
  const directChats = await chatRepo.findAllDirects(userId);

  logger.info(`Retrieval of all chats successful for user id=${userId}`);
  return [...directChats, ...groupChats];
}

async function fetchChat(userId: string, chatId: string) {
  logger.debug(
    `Attempting to retrieve chat of user id=${userId} and chat id=${chatId}`
  );
  const user = await userRepo.findByID(userId);
  if (!user) {
    logger.warn(
      `Chat retrieval failed: No user found with user id=${userId} and chat id=${chatId}`
    );
    throw new UnauthorizedError();
  }

  logger.info(
    `Retrieval of chat with chat id=${chatId} successful for user id=${userId}`
  );
  return await chatRepo.findOne(chatId);
}

async function removeChat(userId: string, chatId: string) {
  logger.debug(`Attempting to remove chat of chat id=${chatId}`);
  const user = await userRepo.findByID(userId);
  if (!user) {
    logger.warn(`Chat removal failed: No user found with user id=${userId}`);
    throw new UnauthorizedError();
  }

  const chat = await chatRepo.findOne(chatId);
  if (!chat) {
    logger.warn(`Chat removal failed: No chat found with chat id=${chatId}`);
    throw new NotFoundError("Chat not exists");
  }

  if (chat.type === "group" && chat.adminID !== user.id) {
    logger.warn(
      `Chat removal failed: user with user id=${userId} is not Admin`
    );
    throw new UnauthorizedError("You don't have permission for delete");
  }

  logger.info(`Removal of chat with chat id=${chatId} successful`);
  return await chatRepo.deleteChat(chat.id);
}

async function fetchAllMessage(
  userId: string,
  chatId: string,
  page: number,
  limit: number
) {
  logger.debug(
    `Attempting to retrieve all messages for chat of chat id=${chatId}`
  );
  const user = await userRepo.findByID(userId);
  if (!user) {
    logger.warn(
      `Message retrieval failed: No user found with user id=${userId}`
    );
    throw new UnauthorizedError();
  }

  const chat = await chatRepo.findOne(chatId);
  if (!chat) {
    logger.warn(
      `Message retrieval failed: No chat found with chat id=${chatId}`
    );
    throw new NotFoundError("Chat not exists");
  }

  const paginatedMessageResponse = await messageRepo.fetchAll(
    chat.id,
    page,
    limit
  );

  logger.info(`Messages retrieval of chat with chat id=${chatId} successful`);
  return paginatedMessageResponse;
}

async function addParticipants(
  userId: string,
  chatId: string,
  participantIds: ParticipantIds
) {
  logger.debug(`Attempting to add participants for chat of chat id=${chatId}`);
  const user = await userRepo.findByID(userId);
  if (!user) {
    logger.warn(
      `Add participants failed: No user found with user id=${userId}`
    );
    throw new UnauthorizedError();
  }

  const chat = await chatRepo.findOne(chatId);
  if (!chat) {
    logger.warn(
      `Add participants failed: No chat found with chat id=${chatId}`
    );
    throw new NotFoundError("Chat not exists");
  }

  if (chat.type === "direct") {
    logger.warn(
      `Add participants failed: chat with chat id=${chatId} is a direct chat`
    );
    throw new BadRequestError("Can't add participants to a direct chat");
  }

  if (chat.adminID !== user.id) {
    logger.warn(
      `Add participants failed: user with user id=${userId} is not Admin`
    );
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

  const participants = await chatParticipantRepo.createParticipants(
    chat.id,
    ...participantValues
  );

  logger.info(`Add participants to chat with chat id=${chatId} successful`);
  return participants;
}

async function removeParticipants(
  userId: string,
  chatId: string,
  participantId: string
) {
  logger.debug(
    `Attempting to remove participant for chat of chat id=${chatId}`
  );
  const user = await userRepo.findByID(userId);
  if (!user) {
    logger.warn(
      `Remove participants failed: No user found with user id=${userId}`
    );
    throw new UnauthorizedError();
  }

  const chat = await chatRepo.findOne(chatId);
  if (!chat) {
    logger.warn(
      `Remove participant failed: No chat found with chat id=${chatId}`
    );
    throw new NotFoundError("Chat not exists");
  }

  if (chat.type === "direct") {
    logger.warn(
      `Remove participant failed: chat with chat id=${chatId} is a direct chat`
    );
    throw new BadRequestError("Can't remove participants from a direct chat");
  }

  if (chat.adminID !== user.id) {
    logger.warn(
      `Remove participants failed: user with user id=${userId} is not Admin`
    );
    throw new UnauthorizedError(
      "You don't have permission for remove participants"
    );
  }

  logger.info(
    `Remove participant with participant id=${participantId} from chat with chat id=${chatId} successful`
  );
  return await chatParticipantRepo.delete(chat.id, participantId);
}

async function fetchAllParticipants(userId: string, chatId: string) {
  logger.debug(
    `Attempting to retrieve all participants for chat of chat id=${chatId}`
  );
  const user = await userRepo.findByID(userId);
  if (!user) {
    logger.warn(
      `Retrieval of participants failed: No user found with user id=${userId}`
    );
    throw new UnauthorizedError();
  }

  const chat = await chatRepo.findOne(chatId);
  if (!chat) {
    logger.warn(
      `Retrieval of participants failed: No chat found with chat id=${chatId}`
    );
    throw new NotFoundError("Chat not exists");
  }

  logger.info(`Retrieved all participants of chat with chat id=${chatId}`);
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
