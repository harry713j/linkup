import { eq } from "drizzle-orm";
import { db } from "../database/index.js";
import { RefreshTokenTable, UserTable } from "@/database/schemas/users.js";

async function create(
  displayName: string,
  email: string,
  passwordHash: string
) {
  const [user] = await db
    .insert(UserTable)
    .values({
      displayName: displayName,
      email: email,
      passwordHash: passwordHash,
    })
    .returning({
      id: UserTable.id,
      displayName: UserTable.displayName,
      email: UserTable.email,
      createdAt: UserTable.createdAt,
      updatedAt: UserTable.updatedAt,
    });

  return user;
}

async function findOneByEmail(email: string) {
  return await db.query.UserTable.findFirst({
    where: eq(UserTable.email, email),
  });
}

async function findByID(id: string) {
  return await db.query.UserTable.findFirst({
    columns: { passwordHash: false },
    where: eq(UserTable.id, id),
  });
}

async function updateEmail(id: string, newEmail: string) {
  const [updatedUser] = await db
    .update(UserTable)
    .set({ email: newEmail })
    .where(eq(UserTable.id, id))
    .returning({
      id: UserTable.id,
      displayName: UserTable.displayName,
      email: UserTable.email,
      createdAt: UserTable.createdAt,
      updatedAt: UserTable.updatedAt,
    });

  return updatedUser
}

async function updatePassword(id: string, passwordHash: string) {
  const [updatedUser] = await db
    .update(UserTable)
    .set({ passwordHash: passwordHash })
    .where(eq(UserTable.id, id))
    .returning({
      id: UserTable.id,
      displayName: UserTable.displayName,
      email: UserTable.email,
      createdAt: UserTable.createdAt,
      updatedAt: UserTable.updatedAt,
    });

  return updatedUser
}

async function updateDisplayName(id: string, updateDisplayName: string) {
  const [updatedUser] = await db.update(UserTable).set({ displayName: updateDisplayName }).where(eq(UserTable.id, id)).returning({
    id: UserTable.id,
    displayName: UserTable.displayName,
    email: UserTable.email,
    createdAt: UserTable.createdAt,
    updatedAt: UserTable.updatedAt,
  })

  return updatedUser
}

async function deleteOne(id: string) {
  return await db.delete(UserTable).where(eq(UserTable.id, id));
}

export const userRepo = {
  create,
  findByID,
  findOneByEmail,
  updateEmail,
  updatePassword,
  updateDisplayName,
  deleteOne,
};

export const refreshTokenRepo = {
  async create(userId: string, token: string, expiresAt: Date) {
    const [refreshToken] = await db
      .insert(RefreshTokenTable)
      .values({ userID: userId, token: token, expiresAt: expiresAt })
      .returning();

    return refreshToken;
  },

  async deleteOne(userId: string) {
    return await db
      .delete(RefreshTokenTable)
      .where(eq(RefreshTokenTable.userID, userId));
  },

  async findOne(token: string) {
    return await db.query.RefreshTokenTable.findFirst({
      where: eq(RefreshTokenTable.token, token),
    });
  },
};
