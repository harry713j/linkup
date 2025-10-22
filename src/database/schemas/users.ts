import {
  bigserial,
  boolean,
  foreignKey,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const UserTable = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    username: text("username").notNull(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [uniqueIndex("username_idx").on(table.username), uniqueIndex("email_idx").on(table.email)]
);

export const UserDetailTable = pgTable(
  "user_details",
  {
    userID: uuid("user_id").primaryKey(),
    displayName: text("display_name"),
    bio: text("bio"),
    status: boolean("status").default(false),
    profileUrl: text("profile_url"),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    foreignKey({
      name: "fk_user",
      columns: [table.userID],
      foreignColumns: [UserTable.id],
    }).onDelete("cascade"),
  ]
);

export const RefreshTokenTable = pgTable(
  "refresh_tokens",
  {
    id: bigserial({ mode: "bigint" }).primaryKey(),
    userID: uuid("user_id").notNull(),
    token: text("token").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("token_idx").on(table.token),
    foreignKey({
      name: "fk_user",
      columns: [table.userID],
      foreignColumns: [UserTable.id],
    }).onDelete("cascade"),
  ]
);
