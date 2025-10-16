import {
  pgTable,
  text,
  timestamp,
  uuid,
  pgEnum,
  foreignKey,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";
import { UserTable } from "./users";

export const ChatTypeEnum = pgEnum("chat_type", ["direct", "group"]);

export const ChatTable = pgTable(
  "chats",
  {
    id: uuid("id").primaryKey(),
    name: text("name").notNull(),
    adminID: uuid("admin_id"),
    groupIcon: text("group_icon"),
    type: ChatTypeEnum("type").default("group"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    foreignKey({
      name: "fk_admin",
      columns: [table.adminID],
      foreignColumns: [UserTable.id],
    }).onDelete("set null"),
    index("chat_name_idx").on(table.name),
  ]
);

export const ParticipantRoleEnum = pgEnum("participant_role", [
  "admin",
  "participant",
]);

export const ChatParticipantTable = pgTable(
  "chat_participants",
  {
    chatID: uuid("chat_id").notNull(),
    participantID: uuid("participant_id").notNull(),
    role: ParticipantRoleEnum("role").default("participant"),
    joinedAt: timestamp("joined_at").defaultNow(),
  },
  (table) => [
    foreignKey({
      name: "fk_participant",
      columns: [table.participantID],
      foreignColumns: [UserTable.id],
    }).onDelete("cascade"),
    foreignKey({
      name: "fk_chat",
      columns: [table.chatID],
      foreignColumns: [ChatTable.id],
    }).onDelete("cascade"),
    primaryKey({
      name: "pk_chat_participant",
      columns: [table.chatID, table.participantID],
    }),
  ]
);
