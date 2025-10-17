import { db, Transaction } from "@/database/index.js";
import { ChatParticipantTable, ChatTable } from "@/database/schemas/chats";
import type { ChatType } from "@/validations/chat.schema.js";
import { eq, sql } from "drizzle-orm";
import type { Participant } from "@/types/chat";

async function create(
  tx: Transaction,
  type: ChatType,
  name: string,
  adminId?: string,
  groupIcon?: string
) {
  const insertData: any = {};
  insertData.type = type;
  insertData.name = name;
  if (adminId) {
    insertData.adminID = adminId;
  }
  if (groupIcon) {
    insertData.groupIcon = groupIcon;
  }

  const [chat] = await tx.insert(ChatTable).values(insertData).returning();

  return chat;
}

async function update(
  chatId: string,
  name?: string,
  groupIcon?: string,
  adminId?: string
) {
  const updateData: any = {};

  if (name) {
    updateData.name = name;
  }
  if (adminId) {
    updateData.adminID = adminId;
  }
  if (groupIcon) {
    updateData.groupIcon = groupIcon;
  }

  const [updatedChat] = await db
    .update(ChatTable)
    .set(updateData)
    .where(eq(ChatTable.id, chatId))
    .returning();
  return updatedChat;
}

async function findAll(userId: string) {
  return await db.query.ChatParticipantTable.findMany({
    where: eq(ChatParticipantTable.participantID, userId),
    with: {
      chat: true,
    },
  });
}

async function findOne(chatId: string) {
  return await db.query.ChatTable.findFirst({
    where: eq(ChatTable.id, chatId),
    with: {
      creator: true,
      participants: true,
    },
  });
}

async function deleteChat(chatId: string) {
  const [deletedId] = await db
    .delete(ChatTable)
    .where(eq(ChatTable.id, chatId))
    .returning({ chatId: ChatTable.id });
  return deletedId;
}

export const chatRepo = {
  create,
  update,
  findAll,
  findOne,
  deleteChat,
};

export const chatParticipantRepo = {
  async create(
    tx: Transaction,
    chatId: string,
    ...participants: Participant[]
  ) {
    const insertData = participants.map((participant) => {
      return {
        chatID: chatId,
        participantID: participant.participantID,
        role: participant.role,
      };
    });
    const insertResult = await tx
      .insert(ChatParticipantTable)
      .values(insertData)
      .returning();

    return insertResult;
  },
  async findAll(chatId: string) {
    return await db.query.ChatParticipantTable.findMany({
      where: eq(ChatParticipantTable.chatID, chatId),
      with: {
        user: {
          with: {
            userDetail: true,
          },
        },
      },
    });
  },
  async createParticipants(chatId: string, ...participants: Participant[]) {
    const insertData = participants.map((participant) => {
      return {
        chatID: chatId,
        participantID: participant.participantID,
        role: participant.role,
      };
    });
    const insertResult = await db
      .insert(ChatParticipantTable)
      .values(insertData)
      .returning();

    return insertResult;
  },
  async delete(chatId: string, participantId: string) {
    const deleteResult = await db
      .delete(ChatParticipantTable)
      .where(
        sql`${ChatParticipantTable.chatID} = ${chatId} AND ${ChatParticipantTable.participantID} = ${participantId}`
      )
      .returning();
    return deleteResult;
  },
};
