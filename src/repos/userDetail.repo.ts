import { db } from "@/database/index.js";
import { UserDetailTable, UserTable } from "@/database/schemas/users.js";
import { eq, like, sql } from "drizzle-orm";

async function create(userId: string, displayName: string) {
  return await db
    .insert(UserDetailTable)
    .values({ userID: userId, displayName: displayName });
}

async function update(
  userId: string,
  data: { bio?: string; status?: boolean; displayName?: string }
) {
  const updateData: any = {};
  if (data.bio) {
    updateData.bio = data.bio;
  }

  if (!data.displayName) {
    updateData.displayName = data.displayName;
  }

  if (typeof data.status === "boolean") {
    updateData.status = data.status;
  }

  if (Object.keys(updateData).length === 0) {
    return;
  }

  return await db
    .update(UserDetailTable)
    .set(updateData)
    .where(eq(UserDetailTable.userID, userId))
    .returning();
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
      chatParticipants: true,
    },
  });
}

async function findAll(page: number, limit: number, keyword: string) {
  if (page < 0) {
    page = 1;
  }

  if (limit < 10) {
    limit = 10;
  }

  const offset = (page - 1) * limit;

  const users = await db.query.UserTable.findMany({
    columns: {
      id: true,
      username: true,
      email: true,
    },
    where: like(UserTable.username, keyword),
    with: {
      userDetail: {
        columns: {
          displayName: true,
          profileUrl: true,
        },
      },
    },
    limit: limit,
    offset: offset,
  });

  const result = await db.execute(
    sql`SELECT COUNT(id) AS count FROM ${UserTable} WHERE username ILIKE %${keyword}%`
  );
  const usersCount = Number(result.rows[0]?.count ?? 0);
  const totalPages = (usersCount + limit - 1) / limit;

  return {
    data: users,
    meta: {
      pages: totalPages,
      page: page,
      limit: limit,
      total: usersCount,
    },
  };
}

export const userDetailRepo = {
  create,
  update,
  updateProfileUrl,
  findByID,
  deleteProfileUrl,
  findAll,
};
