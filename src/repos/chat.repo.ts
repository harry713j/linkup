import { db, Transaction } from "@/database/index.js";
import { ChatParticipantTable, ChatTable } from "@/database/schemas/chats.js";
import type { ChatType } from "@/validations/chat.schema.js";
import { and, eq, inArray, sql } from "drizzle-orm";
import type { Participant } from "@/types/chat";
import logger from "@/logging/logger.js";

async function create(
  tx: Transaction,
  type: ChatType,
  name: string,
  adminId?: string,
  groupIcon?: string
) {
  try {
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

    logger.debug(
      `Crate chat entry with id=${chat.id}, name=${name} and type=${type}`
    );
    return chat;
  } catch (error) {
    const err = error as Error;
    logger.error(
      `Failed to create chat entry in DB with name=${name} and type=${type}: ${err.message}`,
      { stack: err.message }
    );

    throw error;
  }
}

async function update(
  chatId: string,
  name?: string,
  groupIcon?: string,
  adminId?: string
) {
  try {
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

    logger.debug(`Update chat entry with id=${chatId}`);
    return updatedChat;
  } catch (error) {
    const err = error as Error;
    logger.error(
      `Failed to update chat entry in DB with chat id=${chatId}: ${err.message}`,
      { stack: err.message }
    );

    throw error;
  }
}

async function findAllGroups(userId: string) {
  try {
    const chats = await db.query.ChatTable.findMany({
      where: and(
        eq(ChatTable.type, "group"),
        inArray(
          ChatTable.id,
          db
            .select({ id: ChatParticipantTable.chatID })
            .from(ChatParticipantTable)
            .where(eq(ChatParticipantTable.participantID, userId))
        )
      ),
      columns: { id: true, name: true, type: true, groupIcon: true },
    });

    const result = chats.map((chat) => {
      return {
        id: chat.id,
        type: chat.type,
        icon: chat.groupIcon,
        name: chat.name,
      };
    });

    logger.debug("Fetched all group chats of an user with user id=" + userId);
    return result;
  } catch (error) {
    const err = error as Error;
    logger.error(
      `Failed to fetch group chats of user with user id=${userId}: ${err.message}`,
      { stack: err.message }
    );

    throw error;
  }
}

async function findAllDirects(userId: string) {
  try {
    const chats = await db.query.ChatTable.findMany({
      where: and(
        eq(ChatTable.type, "group"),
        inArray(
          ChatTable.id,
          db
            .select({ id: ChatParticipantTable.chatID })
            .from(ChatParticipantTable)
            .where(eq(ChatParticipantTable.participantID, userId))
        )
      ),
      columns: { id: true, type: true },
      with: {
        participants: {
          columns: {
            participantID: true,
          },
          with: {
            user: {
              with: {
                userDetail: {
                  columns: {
                    displayName: true,
                    profileUrl: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const result = chats.map((chat) => {
      const other = chat.participants.find((p) => p.participantID !== userId);

      return {
        id: chat.id,
        type: chat.type,
        name: other?.user?.userDetail?.displayName,
        icon: other?.user?.userDetail?.profileUrl ?? null,
      };
    });

    logger.debug("Fetched all direct chats of an user with user id=" + userId);
    return result;
  } catch (error) {
    const err = error as Error;
    logger.error(
      `Failed to fetch direct chats of user with user id=${userId}: ${err.message}`,
      { stack: err.message }
    );

    throw error;
  }
}

async function findOne(chatId: string) {
  try {
    const chat = await db.query.ChatTable.findFirst({
      where: eq(ChatTable.id, chatId),
      with: {
        participants: {
          columns: {
            role: true,
            joinedAt: true,
          },
          with: {
            user: {
              columns: {
                username: true,
                email: true,
                id: true,
              },
              with: {
                userDetail: true,
              },
            },
          },
          limit: 10,
        },
      },
    });

    logger.debug(`Fetch chat with chat id=${chatId}`);
    return chat;
  } catch (error) {
    const err = error as Error;
    logger.error(
      `Failed to fetch chat with chat id=${chatId}: ${err.message}`,
      { stack: err.message }
    );

    throw error;
  }
}

async function deleteChat(chatId: string) {
  try {
    const [deletedId] = await db
      .delete(ChatTable)
      .where(eq(ChatTable.id, chatId))
      .returning({ chatId: ChatTable.id });

    logger.debug(`Remove chat with chat id=${chatId}`);
    return deletedId;
  } catch (error) {
    const err = error as Error;
    logger.error(
      `Failed to remove chat with chat id=${chatId}: ${err.message}`,
      { stack: err.message }
    );

    throw error;
  }
}

export const chatRepo = {
  create,
  update,
  findAllGroups,
  findAllDirects,
  findOne,
  deleteChat,
};

export const chatParticipantRepo = {
  async create(
    tx: Transaction,
    chatId: string,
    ...participants: Participant[]
  ) {
    try {
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

      logger.debug(`Create chat participant entry of chat id=${chatId}`);
      return insertResult;
    } catch (error) {
      const err = error as Error;
      logger.error(
        `Failed to create chat participants entry in DB with chat id=${chatId}: ${err.message}`,
        { stack: err.message }
      );

      throw error;
    }
  },
  async findAll(chatId: string) {
    try {
      const participants = await db.query.ChatParticipantTable.findMany({
        where: eq(ChatParticipantTable.chatID, chatId),
        with: {
          user: {
            with: {
              userDetail: true,
            },
          },
        },
      });

      logger.debug(`Fetched all participants of chat id=${chatId}`);
      return participants;
    } catch (error) {
      const err = error as Error;
      logger.error(
        `Failed to fetch all chat participants with chat id=${chatId}: ${err.message}`,
        { stack: err.message }
      );

      throw error;
    }
  },
  async createParticipants(chatId: string, ...participants: Participant[]) {
    try {
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

      logger.debug(`Create chat participants entry of chat id=${chatId}`);
      return insertResult;
    } catch (error) {
      const err = error as Error;
      logger.error(
        `Failed to create chat participants entry in DB with chat id=${chatId}: ${err.message}`,
        { stack: err.message }
      );

      throw error;
    }
  },
  async delete(chatId: string, participantId: string) {
    try {
      const deleteResult = await db
        .delete(ChatParticipantTable)
        .where(
          sql`${ChatParticipantTable.chatID} = ${chatId} AND ${ChatParticipantTable.participantID} = ${participantId}`
        )
        .returning();

      logger.debug(
        `Remove chat participants with id=${participantId} from chat id=${chatId}`
      );
      return deleteResult;
    } catch (error) {
      const err = error as Error;
      logger.error(
        `Failed to remove chat participant with participant id=${participantId} from chat id=${chatId}: ${err.message}`,
        { stack: err.message }
      );

      throw error;
    }
  },
};
