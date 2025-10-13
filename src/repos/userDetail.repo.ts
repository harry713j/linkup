import { db } from "@/database/index.js";
import { UserDetailTable, UserTable } from "@/database/schemas/users.js";
import { eq } from "drizzle-orm";

async function create(userId: string) {
  return await db.insert(UserDetailTable).values({ userID: userId });
}

async function updateBio(userId: string, bio: string) {
  return await db
    .update(UserDetailTable)
    .set({ bio: bio })
    .where(eq(UserDetailTable.userID, userId));
}

async function updateStatus(userId: string) {
  return await db
    .update(UserDetailTable)
    .set({ status: !UserDetailTable.status })
    .where(eq(UserDetailTable.userID, userId));
}

async function updateProfile(userId: string, profileUrl: string) {
  return await db
    .update(UserDetailTable)
    .set({ profileUrl: profileUrl })
    .where(eq(UserDetailTable.userID, userId));
}

async function findByID(userId: string) {
  return await db.query.UserTable.findFirst({
    columns: { passwordHash: false },
    where: eq(UserTable.id, userId),
    with: {
      userDetail: true,
    },
  });
}

export const userDetailRepo = {
  create,
  updateBio,
  updateProfile,
  updateStatus,
  findByID,
};
