import { eq } from "drizzle-orm";
import { db } from "../database/index.js";
import { UserTable } from "../database/schemas/users.js";
import { UUID } from "crypto";

async function create(
  displayName: string,
  email: string,
  passwordHash: string
) {
  return await db
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
}

async function findOneByEmail(email: string) {
  return await db.query.UserTable.findFirst({
    columns: { passwordHash: false },
    where: eq(UserTable.email, email),
  });
}

async function findByID(id: UUID) {
  return await db.query.UserTable.findFirst({
    columns: { passwordHash: false },
    where: eq(UserTable.id, id),
  });
}

async function updateEmail(id: UUID, newEmail: string) {
  return await db
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
}

async function updatePassword(id: UUID, passwordHash: string) {
  return await db
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
}

async function deleteOne(id: UUID) {
  return await db.delete(UserTable).where(eq(UserTable.id, id));
}

export const userRepo = {
  create,
  findByID,
  findOneByEmail,
  updateEmail,
  updatePassword,
  deleteOne,
};
