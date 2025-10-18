import type { Request, Response, NextFunction } from "express";
import { messageService } from "@/services/message.service.js";
import { DeleteMessageInput } from "@/validations/message.schema.js";

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
    next(error);
  }
}

export const messageController = {
  deleteMessage,
};
