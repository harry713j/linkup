import { db, Transaction } from "@/database/index.js";
import { UserDetailTable, UserTable } from "@/database/schemas/users.js";
import { eq } from "drizzle-orm";

async function create(userId: string) {
  return await db.insert(UserDetailTable).values({ userID: userId });
}

async function update(
  tx: Transaction,
  userId: string,
  data: { bio?: string; status?: boolean }
) {
  const updateData: any = {};
  if (data.bio) {
    updateData.bio = data.bio;
  }

  if (typeof data.status === "boolean") {
    updateData.status = data.status;
  }

  if (Object.keys(updateData).length === 0) {
    return;
  }

  await tx
    .update(UserDetailTable)
    .set(updateData)
    .where(eq(UserDetailTable.userID, userId));
}

async function updateProfileUrl(userId: string, profileUrl: string) {
  return await db
    .update(UserDetailTable)
    .set({ profileUrl: profileUrl })
    .where(eq(UserDetailTable.userID, userId));
}

async function deleteProfileUrl(userId: string) {
  return await db
    .update(UserDetailTable)
    .set({ profileUrl: null })
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
  update,
  updateProfileUrl,
  findByID,
  deleteProfileUrl,
};
