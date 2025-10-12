import { eq } from "drizzle-orm";
import { db } from "../database/index.js";
import { UserTable } from "../database/schemas/users.js";
import { UUID } from "crypto";

export async function create(
  username: string,
  email: string,
  passwordHash: string
) {
  return await db
    .insert(UserTable)
    .values({ username: username, email: email, passwordHash: passwordHash })
    .returning({
      id: UserTable.id,
      username: UserTable.username,
      email: UserTable.email,
      createdAt: UserTable.createdAt,
      updatedAt: UserTable.updatedAt,
    });
}

export async function findOne(username: string) {
  return await db.query.UserTable.findFirst({
    columns: { passwordHash: false },
    where: eq(UserTable.username, username),
  });
}

export async function findOneByEmail(email: string) {
  return await db.query.UserTable.findFirst({
    columns: { passwordHash: false },
    where: eq(UserTable.email, email),
  });
}

export async function findByID(id: UUID) {
  return await db.query.UserTable.findFirst({
    columns: { passwordHash: false },
    where: eq(UserTable.id, id),
  });
}

export async function updateEmail(id: UUID, newEmail: string) {
  return await db
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
}

export async function updatePassword(id: UUID, passwordHash: string) {
  return await db
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
}

export async function deleteOne(id: UUID) {
  return await db.delete(UserTable).where(eq(UserTable.id, id));
}
