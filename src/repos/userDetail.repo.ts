import { UUID } from "crypto";
import { db } from "../database/index.js";
import { UserDetailTable } from "../database/schemas/users.js";
import { eq } from "drizzle-orm";

export async function create(userId: UUID, displayName: string) {
  return await db
    .insert(UserDetailTable)
    .values({ userID: userId, displayName: displayName });
}

export async function updateOne(
  userId: UUID,
  displayName: string,
  bio: string,
  profileUrl: string
) {
  return await db
    .update(UserDetailTable)
    .set({ displayName: displayName, bio: bio, profileUrl: profileUrl })
    .where(eq(UserDetailTable.userID, userId));
}

export async function updateStatus(userId: UUID) {
  return await db
    .update(UserDetailTable)
    .set({ status: !UserDetailTable.status })
    .where(eq(UserDetailTable.userID, userId));
}

export async function updateProfile(userId: UUID, profileUrl: string) {
  return await db
    .update(UserDetailTable)
    .set({ profileUrl: profileUrl })
    .where(eq(UserDetailTable.userID, userId));
}
