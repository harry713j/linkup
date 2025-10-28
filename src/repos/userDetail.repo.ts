import { db } from "@/database/index.js";
import { UserDetailTable, UserTable } from "@/database/schemas/users.js";
import { eq, like, sql } from "drizzle-orm";
import logger from "@/logging/logger.js";

async function create(userId: string, displayName: string) {
  try {
    const user = await db
      .insert(UserDetailTable)
      .values({ userID: userId, displayName: displayName });

    logger.debug(`User details entry created for user id=${userId}`);
    return user;
  } catch (error) {
    const err = error as Error;
    logger.error(`Failed to create user details entry in DB: ${err.message}`, {
      stack: err.message,
    });

    throw error;
  }
}

async function update(
  userId: string,
  data: { bio?: string; status?: boolean; displayName?: string }
) {
  try {
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

    const userDetail = await db
      .update(UserDetailTable)
      .set(updateData)
      .where(eq(UserDetailTable.userID, userId))
      .returning();

    logger.debug(`Update user detail for user id=${userId}`);
    return userDetail;
  } catch (error) {
    const err = error as Error;
    logger.error(`Failed to update user details entry in DB: ${err.message}`, {
      stack: err.message,
    });

    throw error;
  }
}

async function updateProfileUrl(userId: string, profileUrl: string) {
  try {
    const result = await db
      .update(UserDetailTable)
      .set({ profileUrl: profileUrl })
      .where(eq(UserDetailTable.userID, userId));

    logger.debug(`Update the user profile picture of user id=${userId}`);
    return result;
  } catch (error) {
    const err = error as Error;
    logger.error(
      `Failed to update user profile picture in DB: ${err.message}`,
      { stack: err.message }
    );

    throw error;
  }
}

async function deleteProfileUrl(userId: string) {
  try {
    const result = await db
      .update(UserDetailTable)
      .set({ profileUrl: null })
      .where(eq(UserDetailTable.userID, userId));

    logger.debug(`Remove the user profile picture of user id=${userId}`);
    return result;
  } catch (error) {
    const err = error as Error;
    logger.error(
      `Failed to remove user profile picture in DB: ${err.message}`,
      { stack: err.message }
    );

    throw error;
  }
}

async function findByID(userId: string) {
  try {
    const user = await db.query.UserTable.findFirst({
      columns: { passwordHash: false },
      where: eq(UserTable.id, userId),
      with: {
        userDetail: true,
        chatParticipants: true,
      },
    });

    logger.debug(`Fetched the user details of user id=${userId}`);
    return user;
  } catch (error) {
    const err = error as Error;
    logger.error(`Failed to fetch the user details from DB: ${err.message}`, {
      stack: err.message,
    });

    throw error;
  }
}

async function findAll(page: number, limit: number, keyword: string) {
  try {
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

    logger.debug(
      `Fetch all the user info info with username having keyword=${keyword}, page=${page} and limit=${limit}`
    );
    return {
      data: users,
      meta: {
        pages: totalPages,
        page: page,
        limit: limit,
        total: usersCount,
      },
    };
  } catch (error) {
    const err = error as Error;
    logger.error(
      `Failed to fetched the all user info with username having keywords=${keyword}: ${err.message}`,
      { stack: err.message }
    );

    throw error;
  }
}

export const userDetailRepo = {
  create,
  update,
  updateProfileUrl,
  findByID,
  deleteProfileUrl,
  findAll,
};
