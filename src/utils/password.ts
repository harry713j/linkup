import bcrypt from "bcrypt";

async function generateHash(password: string) {
  return bcrypt.hash(password, 10);
}

async function compare(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}

export const passwordUtil = {
  generateHash,
  compare,
};
