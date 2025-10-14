import { describe, test, expect } from "vitest"
import { jwtUtil } from "../../../src/utils/jwt"

describe("JWT Util", () => {
    const validPayload = {
        userId: "8234ueh-uhsdkdk-hkasdka8724e-askj9923",
        email: "test@test.com"
    }

    describe("generate", () => {
        test("should sign payload correctly", () => {
            const token = jwtUtil.generate(validPayload)

            expect(token).toBeDefined()
            expect(typeof token).toBe("string")
            expect(token).not.toBe(validPayload)
            expect(token.split(".")).toHaveLength(3) // JWT format: header.payload.signature
        })

        test("should generate different tokens for same payload", () => {
            const token1 = jwtUtil.generate(validPayload)
            const token2 = jwtUtil.generate(validPayload)

            expect(token1).not.toBe(token2) // Different due to timestamps or nonces
        })

        test("should include payload data in token", () => {
            const token = jwtUtil.generate(validPayload)
            const decoded = jwtUtil.verify(token)

            expect(decoded.userId).toBe(validPayload.userId)
            expect(decoded.email).toBe(validPayload.email)
        })
    })

    describe("verify", () => {
        test("should verify valid token", () => {
            const token = jwtUtil.generate(validPayload)
            const decoded = jwtUtil.verify(token)

            expect(decoded).toBeDefined()
            expect(decoded.userId).toBe(validPayload.userId)
            expect(decoded.email).toBe(validPayload.email)
        })

        test("should throw error for invalid token", () => {
            const invalidToken = "invalid.token.here"

            expect(() => jwtUtil.verify(invalidToken)).toThrow()
        })

        test("should throw error for malformed token", () => {
            const malformedTokens = [
                "onlyonepart",
                "two.parts",
                "four.parts.here.extra",
                ""
            ]

            malformedTokens.forEach(token => {
                expect(() => jwtUtil.verify(token)).toThrow()
            })
        })

        test("should throw error for tampered token", () => {
            const token = jwtUtil.generate(validPayload)
            const parts = token.split(".")

            // Tamper with payload
            parts[1] = Buffer.from(JSON.stringify({ userId: "hacker" })).toString("base64")
            const tamperedToken = parts.join(".")

            expect(() => jwtUtil.verify(tamperedToken)).toThrow()
        })


        test("should throw error for unsigned token", () => {
            // Create a JWT without proper signature
            const header = Buffer.from(JSON.stringify({ alg: "HS256" })).toString("base64")
            const payload = Buffer.from(JSON.stringify(validPayload)).toString("base64")
            const fakeToken = `${header}.${payload}.fakesignature`

            expect(() => jwtUtil.verify(fakeToken)).toThrow()
        })

        test("should preserve all payload fields", () => {
            const complexPayload = {
                userId: "123",
                email: "test@test.com",
            }

            const token = jwtUtil.generate(complexPayload)
            const decoded = jwtUtil.verify(token)

            expect(decoded.userId).toBe(complexPayload.userId)
            expect(decoded.email).toBe(complexPayload.email)
        })
    })

    describe("edge cases", () => {
        test("should handle special characters in payload", () => {
            const specialPayload = {
                userId: "!@#$%^&*()",
                email: "test+special@test.co.uk"
            }

            const token = jwtUtil.generate(specialPayload)
            const decoded = jwtUtil.verify(token)

            expect(decoded.userId).toBe(specialPayload.userId)
            expect(decoded.email).toBe(specialPayload.email)
        })

        test("should handle unicode characters", () => {
            const unicodePayload = {
                userId: "用户123",
                email: "用户@test.com"
            }

            const token = jwtUtil.generate(unicodePayload)
            const decoded = jwtUtil.verify(token)

            expect(decoded.userId).toBe(unicodePayload.userId)
            expect(decoded.email).toBe(unicodePayload.email)
        })
    })

    describe("token integrity", () => {
        test("should not decrypt or expose sensitive data", () => {
            const token = jwtUtil.generate(validPayload)

            // Token should not contain the secret in plain text
            expect(token).not.toContain("secret")
            expect(token).not.toContain("key")
        })

        test("should produce consistent signatures for valid tokens", () => {
            const token = jwtUtil.generate(validPayload)

            // Verifying multiple times should always succeed
            expect(() => jwtUtil.verify(token)).not.toThrow()
            expect(() => jwtUtil.verify(token)).not.toThrow()
            expect(() => jwtUtil.verify(token)).not.toThrow()
        })
    })
})