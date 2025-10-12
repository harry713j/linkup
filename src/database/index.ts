import { drizzle } from "drizzle-orm/neon-http";
import { DATABASE_URL } from "../constants.js";

export const db = drizzle({ connection: DATABASE_URL, casing: "snake_case" });
