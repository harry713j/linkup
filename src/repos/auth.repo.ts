import { eq } from "drizzle-orm";
import { db } from "../database/index.js";
import { RefreshTokenTable, UserTable } from "@/database/schemas/users.js";
import logger from "@/logging/logger.js";

async function create(username: string, email: string, passwordHash: string) {
  try {
    const [user] = await db
      .insert(UserTable)
      .values({
        username: username,
        email: email,
        passwordHash: passwordHash,
      })
      .returning({
        id: UserTable.id,
        username: UserTable.username,
        email: UserTable.email,
        createdAt: UserTable.createdAt,
        updatedAt: UserTable.updatedAt,
      });

    logger.debug("Create user entry with id=" + user.id);
    return user;
  } catch (err) {
    const error = err as Error;
    logger.error("Failed to create the user: " + error.message, {
      stack: error.stack,
    });

    throw error;
  }
}

async function findOneByEmail(email: string) {
  try {
    const user = await db.query.UserTable.findFirst({
      where: eq(UserTable.email, email),
    });

    logger.debug("Fetched user with email=" + email);
    return user;
  } catch (err) {
    const error = err as Error;
    logger.error(
      "Failed to fetch the user with email=" + email + ": " + error.message,
      {
        stack: error.stack,
      }
    );

    throw error;
  }
}

async function findByUsername(username: string) {
  try {
    const user = await db.query.UserTable.findFirst({
      where: eq(UserTable.username, username),
    });
    logger.debug("Fetched user with username=" + username);
    return user;
  } catch (error) {
    const err = error as Error;
    logger.error(
      "Failed to fetch the user with username=" +
        username +
        " : " +
        err.message,
      {
        stack: err.stack,
      }
    );

    throw err;
  }
}

async function findByID(id: string) {
  try {
    const user = await db.query.UserTable.findFirst({
      where: eq(UserTable.id, id),
    });

    logger.debug(`Fetch user with user id=${id}`);
    return user;
  } catch (error) {
    const err = error as Error;
    logger.error(
      "Failed to fetch the user with id=" + id + " : " + err.message,
      {
        stack: err.stack,
      }
    );

    throw err;
  }
}

async function updateEmail(id: string, newEmail: string) {
  try {
    const [updatedUser] = await db
      .update(UserTable)
      .set({ email: newEmail })
      .where(eq(UserTable.id, id))
      .returning({
        id: UserTable.id,
        username: UserTable.username,
        email: UserTable.email,
        createdAt: UserTable.createdAt,
        updatedAt: UserTable.updatedAt,
      });
    logger.debug(`Update user email of user id=${id}`);

    return updatedUser;
  } catch (error) {
    const err = error as Error;
    logger.error(
      "Failed to update the user email with id=" + id + " : " + err.message,
      {
        stack: err.stack,
      }
    );

    throw err;
  }
}

async function updatePassword(id: string, passwordHash: string) {
  try {
    const [updatedUser] = await db
      .update(UserTable)
      .set({ passwordHash: passwordHash })
      .where(eq(UserTable.id, id))
      .returning({
        id: UserTable.id,
        username: UserTable.username,
        email: UserTable.email,
        createdAt: UserTable.createdAt,
        updatedAt: UserTable.updatedAt,
      });

    logger.debug("Update user password of user id=" + id);

    return updatedUser;
  } catch (error) {
    const err = error as Error;
    logger.error(
      "Failed to update the user password with id=" + id + " : " + err.message,
      {
        stack: err.stack,
      }
    );

    throw err;
  }
}

async function deleteOne(id: string) {
  try {
    const result = await db.delete(UserTable).where(eq(UserTable.id, id));
    logger.debug("Delete user with user id=" + id);
    return result;
  } catch (error) {
    const err = error as Error;
    logger.error(
      "Failed to delete the user with id=" + id + " : " + err.message,
      {
        stack: err.stack,
      }
    );

    throw err;
  }
}

export const userRepo = {
  create,
  findByID,
  findOneByEmail,
  findByUsername,
  updateEmail,
  updatePassword,
  deleteOne,
};

export const refreshTokenRepo = {
  async create(userId: string, token: string, expiresAt: Date) {
    try {
      const [refreshToken] = await db
        .insert(RefreshTokenTable)
        .values({ userID: userId, token: token, expiresAt: expiresAt })
        .returning();

      logger.debug(`Create Refresh Token entry with userId=${userId}`);
      return refreshToken;
    } catch (error) {
      const err = error as Error;
      logger.error(
        "Failed to create the Refresh Token with userId=" +
          userId +
          " : " +
          err.message,
        {
          stack: err.stack,
        }
      );

      throw err;
    }
  },

  async deleteOne(userId: string) {
    try {
      const result = await db
        .delete(RefreshTokenTable)
        .where(eq(RefreshTokenTable.userID, userId));
      logger.debug(`Delete Refresh Token with userId=${userId}`);
      return result;
    } catch (error) {
      const err = error as Error;
      logger.error(
        "Failed to delete the Refresh Token with userId=" +
          userId +
          " : " +
          err.message,
        {
          stack: err.stack,
        }
      );

      throw err;
    }
  },

  async findOne(token: string) {
    try {
      const rToken = await db.query.RefreshTokenTable.findFirst({
        where: eq(RefreshTokenTable.token, token),
      });
      logger.debug("Retrieve Refresh Token with token value=" + token);
      return rToken;
    } catch (error) {
      const err = error as Error;
      logger.error(
        "Failed to retrieve the Refresh Token with token value=" +
          token +
          " : " +
          err.message,
        {
          stack: err.stack,
        }
      );

      throw err;
    }
  },
};
