import type { Request, Response, NextFunction } from "express";
import { chatService } from "@/services/chat.service.js";
import {
  CreateChatInput,
  UpdateChatInput,
  AddParticipantInput,
} from "@/validations/chat.schema.js";

async function createChat(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    const data: CreateChatInput = req.body;
    const chat = await chatService.createChat(userId as string, data);

    res.status(201).json({
      message: "Chat created successfully",
      chat: chat,
    });
  } catch (error) {
    next(error);
  }
}

async function updateChat(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    const data: UpdateChatInput = req.body;
    const { chatId } = req.params;
    const updatedChat = await chatService.updateChat(
      userId as string,
      chatId,
      data
    );

    res.status(200).json({
      message: "Chat updated successfully",
      chat: updatedChat,
    });
  } catch (error) {
    next(error);
  }
}

async function fetchAllChats(req: Request, res: Response, next: NextFunction) {
  // improvement: paginated response
  try {
    const userId = req.user?.id;
    const chats = await chatService.fetchAllChats(userId as string);

    res.status(200).json({
      message: "Chats fetched successfully",
      chats: chats,
    });
  } catch (error) {
    next(error);
  }
}

async function fetchChat(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    const { chatId } = req.params;
    const chat = await chatService.fetchChat(userId as string, chatId);

    res.status(200).json({
      message: "Chat fetched successfully",
      chat: chat,
    });
  } catch (error) {
    next(error);
  }
}

async function removeChat(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    const { chatId } = req.params;
    await chatService.removeChat(userId as string, chatId);

    res.status(200).json({
      message: "Chat removed successfully",
    });
  } catch (error) {
    next(error);
  }
}

async function addParticipants(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.id;
    const { chatId } = req.params;
    const data: AddParticipantInput = req.body;
    const participants = await chatService.addParticipants(
      userId as string,
      chatId,
      data.participants
    );

    res.status(201).json({
      message: "Participants added successfully",
      participants: participants,
    });
  } catch (error) {
    next(error);
  }
}

async function removeParticipants(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.id;
    const { chatId, participantId } = req.params;
    await chatService.removeParticipants(
      userId as string,
      chatId,
      participantId
    );

    res.status(200).json({
      message: "Participant removed successfully",
    });
  } catch (error) {
    next(error);
  }
}

async function fetchAllParticipants(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.id;
    const { chatId } = req.params;
    const participants = await chatService.fetchAllParticipants(
      userId as string,
      chatId
    );

    res.status(200).json({
      message: "Participants fetched successfully",
      participants: participants,
    });
  } catch (error) {
    next(error);
  }
}

export const chatController = {
  createChat,
  updateChat,
  fetchAllChats,
  fetchChat,
  removeChat,
  addParticipants,
  removeParticipants,
  fetchAllParticipants,
};
