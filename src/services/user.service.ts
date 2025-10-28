import { userRepo } from "@/repos/auth.repo.js";
import { userDetailRepo } from "@/repos/userDetail.repo.js";
import { BadRequestError, UnauthorizedError } from "@/errors/ApiError.js";
import { passwordUtil } from "@/utils/password.js";
import { UpdateUserDetailInput } from "@/validations/user.schema.js";
import logger from "@/logging/logger.js";

async function update(userId: string, data: UpdateUserDetailInput) {
  logger.debug("Attempting to update user details");
  const existingUser = await userRepo.findByID(userId);
  if (!existingUser) {
    logger.warn(
      `User details update failed: No user found with user id=${userId}`
    );
    throw new UnauthorizedError();
  }

  logger.info(`User details updated successfully of user id=${userId}`);
  return await userDetailRepo.update(userId, data);
}

async function updateEmail(userId: string, email: string) {
  logger.debug("Attempting to update user email");
  const existingUser = await userRepo.findByID(userId);
  if (!existingUser) {
    logger.warn(
      `User email update failed: No user found with user id=${userId}`
    );
    throw new UnauthorizedError();
  }

  const updatedUser = await userRepo.updateEmail(existingUser.id, email);
  logger.info(`User email updated successfully of user id=${userId}`);
  return updatedUser;
}

async function updatePassword(
  userId: string,
  oldPassword: string,
  newPassword: string
) {
  logger.debug("Attempting to update user password");
  const existingUser = await userRepo.findByID(userId);
  if (!existingUser) {
    logger.warn(
      `User password update failed: No user found with user id=${userId}`
    );
    throw new UnauthorizedError();
  }

  const isCorrect = await passwordUtil.compare(
    existingUser.passwordHash,
    oldPassword
  );
  if (!isCorrect) {
    logger.warn(
      `User password update failed: incorrect password provided for user id=${userId}`
    );
    throw new BadRequestError("Invalid credential");
  }
  const passwordHash = await passwordUtil.generateHash(newPassword);
  const updatedUser = await userRepo.updatePassword(
    existingUser.id,
    passwordHash
  );

  logger.info(`User password updated successfully of user id=${userId}`);
  return updatedUser;
}

async function updateProfileUrl(userId: string, profileUrl: string) {
  logger.debug("Attempting to update user profile picture");
  const existingUser = await userRepo.findByID(userId);
  if (!existingUser) {
    logger.warn(
      `User profile picture update failed: No user found with user id=${userId}`
    );
    throw new UnauthorizedError();
  }

  await userDetailRepo.updateProfileUrl(existingUser.id, profileUrl);
  const user = await userDetailRepo.findByID(existingUser.id);

  logger.info(`User profile picture updated successfully of user id=${userId}`);
  return user;
}

async function removeProfileUrl(userId: string) {
  logger.debug("Attempting to delete user profile picture");
  const existingUser = await userRepo.findByID(userId);
  if (!existingUser) {
    logger.warn(
      `User profile picture delete failed: No user found with user id=${userId}`
    );
    throw new UnauthorizedError();
  }

  await userDetailRepo.deleteProfileUrl(existingUser.id);
  const user = await userDetailRepo.findByID(existingUser.id);

  logger.info(`User profile picture delete successfully of user id=${userId}`);
  return user;
}

async function fetchUser(userId: string) {
  logger.debug("Attempting to retrieve user details");
  const existingUser = await userRepo.findByID(userId);
  if (!existingUser) {
    logger.warn(
      `User detail retrieval failed: No user found with user id=${userId}`
    );
    throw new UnauthorizedError();
  }

  const user = await userDetailRepo.findByID(existingUser.id);

  logger.info(`Retrieved user details successfully of user id=${userId}`);
  return user;
}

async function fetchAll(
  userId: string,
  pageStr: string,
  limitStr: string,
  keyword: string
) {
  logger.debug("Attempting to retrieve matching keyword user details");
  const existingUser = await userRepo.findByID(userId);
  if (!existingUser) {
    logger.warn(
      `User detail retrieval with keyword=${keyword} failed: No user found with user id=${userId}`
    );
    throw new UnauthorizedError();
  }
  const page = Number(pageStr);
  const limit = Number(limitStr);
  const paginatedResponse = await userDetailRepo.findAll(page, limit, keyword);

  logger.info(
    `Retrieved all user details successfully with username included keyword=${keyword}`
  );
  return paginatedResponse;
}

export const userService = {
  updateEmail,
  updatePassword,
  updateProfileUrl,
  removeProfileUrl,
  update,
  fetchUser,
  fetchAll,
};
