import { drizzle } from "drizzle-orm/neon-http";
import { config } from "../config/config.js";
import * as userSchema from "./schemas/users.js";
import * as chatSchema from "./schemas/chats.js";
import * as messageSchema from "./schemas/messages.js";
import * as relations from "./schemas/relations.js"

export const db = drizzle({
  connection: config.dbUrl,
  casing: "snake_case",
  schema: { ...chatSchema, ...userSchema, ...messageSchema, ...relations },
});

export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
