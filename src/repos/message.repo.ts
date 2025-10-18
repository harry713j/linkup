import { db, Transaction } from "@/database/index.js";
import {
  MessageStatusTable,
  MessageTable,
} from "@/database/schemas/messages.js";
import { MessageType, MessageState } from "@/validations/message.schema.js";
import { eq, sql } from "drizzle-orm";

async function create(
  tx: Transaction,
  chatId: string,
  senderId: string,
  type: MessageType,
  content?: string,
  attachmentUrl?: string
) {
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
  return message;
}

async function deleteMessage(
  tx: Transaction,
  chatId: string,
  messageId: number
) {
  const [deletedId] = await tx
    .delete(MessageTable)
    .where(
      sql`${MessageTable.chatID} = ${chatId} AND ${MessageTable.id} = ${messageId}`
    )
    .returning({ deletedId: MessageTable.id });
  return deletedId;
}

async function fetchAll(chatId: string, page: number, limit: number) {
  if (page < 1) {
    page = 1;
  }

  if (limit <= 0) {
    limit = 50;
  }

  const offset = (page - 1) * limit;
  const messages = await db.query.MessageTable.findMany({
    with: {
      sender: true,
      messageStatus: true,
    },
    where: eq(MessageTable.chatID, chatId),
    orderBy: sql`${MessageTable.createdAt} DESC`,
    offset: offset,
    limit: limit,
  });

  const result = await db.execute(
    sql`SELECT COUNT(*) AS count FROM ${MessageTable} WHERE ${MessageTable.chatID} = ${chatId}`
  );
  const messagesCount = Number(result.rows[0]?.count ?? 0);
  const totalPages = (messagesCount + limit - 1) / limit;

  return {
    messages: messages,
    meta: {
      total: messagesCount,
      page: page,
      limit: limit,
      totalPages: totalPages,
    },
  };
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
    return insertRes;
  },
  async deleteAll(tx: Transaction, messageId: number) {
    const deleteRes = await tx
      .delete(MessageStatusTable)
      .where(eq(MessageStatusTable.messageID, messageId))
      .returning({ messageId: MessageStatusTable.messageID });

    return deleteRes;
  },
};
