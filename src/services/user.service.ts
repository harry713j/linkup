import { userRepo } from "@/repos/auth.repo.js";
import { userDetailRepo } from "@/repos/userDetail.repo.js";
import { BadRequestError, UnauthorizedError } from "@/errors/ApiError.js";
import { passwordUtil } from "@/utils/password.js";
import { UpdateUserDetailInput } from "@/validations/user.schema.js";

async function update(userId: string, data: UpdateUserDetailInput) {
  const existingUser = await userRepo.findByID(userId);
  if (!existingUser) {
    throw new UnauthorizedError();
  }

  return await userDetailRepo.update(userId, data)
}

async function updateEmail(userId: string, email: string) {
  const existingUser = await userRepo.findByID(userId);
  if (!existingUser) {
    throw new UnauthorizedError();
  }

  const updatedUser = await userRepo.updateEmail(existingUser.id, email);
  return updatedUser;
}

async function updatePassword(
  userId: string,
  oldPassword: string,
  newPassword: string
) {
  const existingUser = await userRepo.findByID(userId);
  if (!existingUser) {
    throw new UnauthorizedError();
  }

  const isCorrect = await passwordUtil.compare(
    existingUser.passwordHash,
    oldPassword
  );
  if (!isCorrect) {
    throw new BadRequestError("Invalid credential");
  }
  const passwordHash = await passwordUtil.generateHash(newPassword);
  const updatedUser = await userRepo.updatePassword(
    existingUser.id,
    passwordHash
  );

  return updatedUser;
}

async function updateProfileUrl(userId: string, profileUrl: string) {
  const existingUser = await userRepo.findByID(userId);
  if (!existingUser) {
    throw new UnauthorizedError();
  }

  await userDetailRepo.updateProfileUrl(existingUser.id, profileUrl);
  const user = await userDetailRepo.findByID(existingUser.id);

  return user;
}

async function removeProfileUrl(userId: string) {
  const existingUser = await userRepo.findByID(userId);
  if (!existingUser) {
    throw new UnauthorizedError();
  }

  await userDetailRepo.deleteProfileUrl(existingUser.id);
  const user = await userDetailRepo.findByID(existingUser.id);

  return user;
}

async function fetchUser(userId: string) {
  const existingUser = await userRepo.findByID(userId);
  if (!existingUser) {
    throw new UnauthorizedError();
  }

  const user = await userDetailRepo.findByID(existingUser.id);

  return user;
}

async function fetchAll(userId: string, pageStr: string, limitStr: string, keyword: string) {
  const existingUser = await userRepo.findByID(userId)
  if (!existingUser) {
    throw new UnauthorizedError()
  }
  const page = Number(pageStr)
  const limit = Number(limitStr)
  const paginatedResponse = await userDetailRepo.findAll(page, limit, keyword)

  return paginatedResponse
}

export const userService = {
  updateEmail,
  updatePassword,
  updateProfileUrl,
  removeProfileUrl,
  update,
  fetchUser,
  fetchAll
};
