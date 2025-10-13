import bcrypt from "bcrypt";

async function generatePasswordHash(password: string) {
  return bcrypt.hash(password, 10);
}

async function comparePassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}

export const passwordUtil = {
  generatePasswordHash,
  comparePassword,
};
