import { relations } from "drizzle-orm";
import { UserTable, UserDetailTable, RefreshTokenTable } from "./users.js";
import { ChatTable, ChatParticipantTable } from "./chats.js";
import { MessageStatusTable, MessageTable } from "./messages.js";

// relationship
export const UserTableRelations = relations(UserTable, ({ one, many }) => {
  return {
    userDetail: one(UserDetailTable),
    refreshToken: one(RefreshTokenTable),
    chatParticipants: many(ChatParticipantTable),
    messages: many(MessageTable),
    messageStatus: many(MessageStatusTable),
    createdChats: many(ChatTable),
  };
});

export const UserDetailTableRelations = relations(
  UserDetailTable,
  ({ one }) => ({
    user: one(UserTable, {
      fields: [UserDetailTable.userID],
      references: [UserTable.id],
    }),
  })
);

export const RefreshTokenTableRelations = relations(
  RefreshTokenTable,
  ({ one }) => ({
    user: one(UserTable, {
      fields: [RefreshTokenTable.userID],
      references: [UserTable.id],
    }),
  })
);

export const ChatTableRelations = relations(ChatTable, ({ one, many }) => {
  return {
    creator: one(UserTable, {
      fields: [ChatTable.adminID],
      references: [UserTable.id],
    }),
    participants: many(ChatParticipantTable),
    messages: many(MessageTable),
  };
});

export const ChatParticipantTableRelations = relations(
  ChatParticipantTable,
  ({ one }) => {
    return {
      chat: one(ChatTable, {
        fields: [ChatParticipantTable.chatID],
        references: [ChatTable.id],
      }),
      user: one(UserTable, {
        fields: [ChatParticipantTable.participantID],
        references: [UserTable.id],
      }),
    };
  }
);

export const MessageTableRelations = relations(
  MessageTable,
  ({ one, many }) => {
    return {
      sender: one(UserTable, {
        fields: [MessageTable.senderID],
        references: [UserTable.id],
      }),
      chat: one(ChatTable, {
        fields: [MessageTable.chatID],
        references: [ChatTable.id],
      }),
      messageStatus: many(MessageStatusTable),
    };
  }
);

export const MessageStatusTableRelations = relations(
  MessageStatusTable,
  ({ one }) => {
    return {
      message: one(MessageTable, {
        fields: [MessageStatusTable.messageID],
        references: [MessageTable.id],
      }),
      user: one(UserTable, {
        fields: [MessageStatusTable.userID],
        references: [UserTable.id],
      }),
    };
  }
);
