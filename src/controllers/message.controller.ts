import type { Request, Response, NextFunction } from "express";
import { messageService } from "@/services/message.service.js";
import { DeleteMessageInput } from "@/validations/message.schema.js";
import logger from "@/logging/logger.js";

async function deleteMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    const { chatId }: DeleteMessageInput = req.body;
    const { messageId } = req.params;

    await messageService.deleteMessage(
      userId as string,
      chatId,
      Number(messageId)
    );

    res.status(204);
  } catch (error) {
    const err = error as Error;
    logger.error(`Failed to delete message from chat: ${err.message}`, {
      stack: err.stack,
    });
    next(error);
  }
}

export const messageController = {
  deleteMessage,
};
