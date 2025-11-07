import { db, Transaction } from "@/database/index.js";
import {
  MessageStatusTable,
  MessageTable,
} from "@/database/schemas/messages.js";
import { MessageType, MessageState } from "@/validations/message.schema.js";
import { eq, sql } from "drizzle-orm";
import logger from "@/logging/logger.js";

async function create(
  tx: Transaction,
  chatId: string,
  senderId: string,
  type: MessageType,
  content?: string,
  attachmentUrl?: string
) {
  try {
    const insertData: any = {};
    insertData.chatID = chatId;
    insertData.senderID = senderId;
    insertData.messageType = type;

    if (content) {
      insertData.content = content;
    }

    if (attachmentUrl) {
      insertData.attachmentUrl = attachmentUrl;
    }

    const [message] = await tx
      .insert(MessageTable)
      .values(insertData)
      .returning();

    logger.debug(
      `Create Message entry in DB with id=${message.id} for chat id=${chatId}`
    );
    return message;
  } catch (error) {
    const err = error as Error;
    logger.error(
      `Failed to create message entry in DB with chat id=${chatId}: ${err.message}`,
      { stack: err.message }
    );

    throw error;
  }
}

async function deleteMessage(
  tx: Transaction,
  chatId: string,
  messageId: number
) {
  try {
    const [deletedId] = await tx
      .delete(MessageTable)
      .where(
        sql`${MessageTable.chatID} = ${chatId} AND ${MessageTable.id} = ${messageId}`
      )
      .returning({ deletedId: MessageTable.id });

    logger.debug(`Remove message with id=${messageId} for chat id=${chatId}`);
    return deletedId;
  } catch (error) {
    const err = error as Error;
    logger.error(
      `Failed to remove message with id=${messageId} for chat id=${chatId}: ${err.message}`,
      { stack: err.message }
    );

    throw error;
  }
}

async function fetchAll(chatId: string, page: number, limit: number) {
  try {
    if (page < 1) {
      page = 1;
    }

    if (limit <= 0) {
      limit = 50;
    }

    const offset = (page - 1) * limit;
    const messages = await db.query.MessageTable.findMany({
      with: {
        sender: {
          columns: {
            id: true, username: true, email: true
          },
          with: {
            userDetail: {
              columns: {
                displayName: true, profileUrl: true, status: true
              }
            }
          }
        },
        messageStatus: true,
      },
      where: eq(MessageTable.chatID, chatId),
      orderBy: sql`${MessageTable.createdAt} DESC`,
      offset: offset,
      limit: limit,
    });

    const flatMessages = messages.map(m => (
      {
        ...m,
        sender: {
          id: m.sender.id,
          username: m.sender.username,
          email: m.sender.email,
          displayName: m.sender.userDetail?.displayName,
          status: m.sender.userDetail?.status,
          profileUrl: m.sender.userDetail?.profileUrl
        }
      }
    ))

    const result = await db.execute(
      sql`SELECT COUNT(*) AS count FROM ${MessageTable} WHERE ${MessageTable.chatID} = ${chatId}`
    );
    const messagesCount = Number(result.rows[0]?.count ?? 0);
    const totalPages = (messagesCount + limit - 1) / limit;

    logger.debug(
      `Fetched all the messages of chat id=${chatId}, page=${page} and limit=${limit}`
    );
    return {
      data: flatMessages,
      meta: {
        total: messagesCount,
        page: page,
        limit: limit,
        pages: totalPages,
      },
    };
  } catch (error) {
    const err = error as Error;
    logger.error(
      `Failed to fetch all messages with chat id=${chatId}, page=${page} and limit=${limit}: ${err.message}`,
      { stack: err.message }
    );

    throw error;
  }
}

export const messageRepo = {
  create,
  deleteMessage,
  fetchAll,
};

export const messageStatusRepo = {
  async upsert(
    tx: Transaction,
    messageId: number,
    state: MessageState,
    ...userIds: string[]
  ) {
    try {
      const insertData = userIds.map((uID) => {
        return {
          messageID: messageId,
          userID: uID,
          state: state,
        };
      });
      const insertRes = await tx
        .insert(MessageStatusTable)
        .values(insertData)
        .onConflictDoNothing({
          target: [
            MessageStatusTable.messageID,
            MessageStatusTable.userID,
            MessageStatusTable.status,
          ],
        })
        .returning();

      logger.debug(
        `Update message status entry in DB with message id=${messageId} with state=${state}`
      );
      return insertRes;
    } catch (error) {
      const err = error as Error;
      logger.error(
        `Failed to update messages status of message id=${messageId} and status=${state}: ${err.message}`,
        { stack: err.message }
      );

      throw error;
    }
  },
  async deleteAll(tx: Transaction, messageId: number) {
    try {
      const deleteRes = await tx
        .delete(MessageStatusTable)
        .where(eq(MessageStatusTable.messageID, messageId))
        .returning({ messageId: MessageStatusTable.messageID });

      logger.debug(
        `Remove all message status entry from DB with message id=${messageId}`
      );
      return deleteRes;
    } catch (error) {
      const err = error as Error;
      logger.error(
        `Failed to delete messages status of message id=${messageId}: ${err.message}`,
        { stack: err.message }
      );

      throw error;
    }
  },
};
