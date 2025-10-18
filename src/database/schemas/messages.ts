import {
  pgTable,
  pgEnum,
  text,
  bigserial,
  uuid,
  foreignKey,
  bigint,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";
import { UserTable } from "./users";
import { ChatTable } from "./chats";

export const MessageTypeEnum = pgEnum("message_type", [
  "text",
  "image",
  "video",
  "file",
]);

export const MessageTable = pgTable(
  "messages",
  {
    id: bigserial({ mode: "number" }).primaryKey(),
    chatID: uuid("chat_id").notNull(),
    senderID: uuid("sender_id").notNull(),
    content: text("content"),
    attachmentUrl: text("attachment_url"),
    messageType: MessageTypeEnum("message_type").default("text"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    foreignKey({
      name: "fk_group",
      columns: [table.chatID],
      foreignColumns: [ChatTable.id],
    }).onDelete("cascade"),
    foreignKey({
      name: "fk_sender",
      columns: [table.senderID],
      foreignColumns: [UserTable.id],
    }).onDelete("set null"),
  ]
);

export const MessageStateEnum = pgEnum("message_state", [
  "sent",
  "delivered",
  "seen",
]);

export const MessageStatusTable = pgTable(
  "message_status",
  {
    messageID: bigint({ mode: "number" }).notNull(),
    userID: uuid("user_id").notNull(),
    status: MessageStateEnum("status").default("sent"),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    primaryKey({
      name: "pk_message_status_user",
      columns: [table.messageID, table.userID],
    }),
    foreignKey({
      name: "fk_message",
      columns: [table.messageID],
      foreignColumns: [MessageTable.id],
    }).onDelete("cascade"),
    foreignKey({
      name: "fk_user",
      columns: [table.userID],
      foreignColumns: [UserTable.id],
    }).onDelete("cascade"),
  ]
);
