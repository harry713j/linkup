import { describe, test, expect } from "vitest";
import { passwordUtil } from "../../../src/utils/password";

describe("Password Util", () => {
  test("Hash password correctly", async () => {
    const password = "secret123";
    const hash = await passwordUtil.generateHash(password);
    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
  });

  test("Verify correct password", async () => {
    const password = "secret123";
    const hash = await passwordUtil.generateHash(password);
    const isCorrect = await passwordUtil.compare(password, hash);
    expect(isCorrect).toBe(true);
  });

  test("Reject wrong password", async () => {
    const password = "secret123";
    const hash = await passwordUtil.generateHash(password);
    const isCorrect = await passwordUtil.compare("wrongSecret1234", hash);
    expect(isCorrect).toBe(false);
  });
});
