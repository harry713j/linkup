import * as z from "zod";

export const registerSchema = z.object({
  displayName: z
    .string()
    .nonempty()
    .min(4, "Display name should have at least 4 characters")
    .max(30, "Display name shouldn't exceed 30 characters"),
  email: z.email({ error: "Invalid email" }),
  password: z
    .string()
    .nonempty()
    .min(6, { error: "Password is too short" })
    .max(20, { error: "Password length must not exceed 20 characters" })
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$!%^&~]).+$/, {
      error:
        "Password must contain at least one letter, one number and one special character like [@,#,$,!,%,^,&,~]",
    }),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
