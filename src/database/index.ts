import { drizzle } from "drizzle-orm/neon-http";
import { config } from "../config/config.js";
import * as userSchema from "./schemas/users.js";
import * as chatSchema from "./schemas/chats.js";
import * as messageSchema from "./schemas/messages.js";

export const db = drizzle({
  connection: config.dbUrl,
  casing: "snake_case",
  schema: { ...chatSchema, ...userSchema, ...messageSchema },
});
