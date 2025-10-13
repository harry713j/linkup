import { UUID } from "crypto";
import { db } from "../database/index.js";
import { RefreshTokenTable } from "../database/schemas/users.js";
import { eq } from "drizzle-orm";

async function create(userId: UUID, token: string, expiresAt: Date) {
  return await db
    .insert(RefreshTokenTable)
    .values({ userID: userId, token: token, expiresAt: expiresAt });
}

async function deleteOne(userId: UUID) {
  return await db
    .delete(RefreshTokenTable)
    .where(eq(RefreshTokenTable.userID, userId));
}

async function findOne(token: string) {
  return await db.query.RefreshTokenTable.findFirst({
    where: eq(RefreshTokenTable.token, token),
  });
}

export const refreshTokenRepo = {
  create,
  deleteOne,
  findOne,
};
