import { userRepo } from "@/repos/auth.repo.js";
import { passwordUtil } from "@/utils/password.js";

async function register(displayName: string, email: string, password: string) {
  const existingUser = await userRepo.findOneByEmail(email);

  if (existingUser) {
    throw new Error("User already exists with this email");
  }
}

async function login(identifier: string, password: string) {}

export const authService = {
  register,
};
