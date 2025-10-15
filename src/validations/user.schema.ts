import * as z from "zod";

export const updateUserDetailSchema = z.object({
  displayName: z
    .string()
    .min(4, "Display name should have at least 4 characters")
    .max(30, "Display name shouldn't exceed 20 characters")
    .optional(),
  bio: z.string().max(256, "Bio should not exceed 256 characters").optional(),
  status: z.boolean().optional(),
});

export const updateEmailSchema = z.object({
  email: z.email({ error: "Invalid email" }),
});

export const updatePasswordSchema = z.object({
  oldPassword: z.string().nonempty(),
  newPassword: z
    .string()
    .nonempty()
    .min(6, { error: "Password is too short" })
    .max(20, { error: "Password length must not exceed 20 characters" })
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$!%^&~]).+$/, {
      error:
        "Password must contain at least one letter, one number and one special character like [@,#,$,!,%,^,&,~]",
    }),
});

export const updateProfileUrl = z.object({
  profileUrl: z.url({ error: "Invalid profile url" }),
});

export type UpdateUserDetailInput = z.infer<typeof updateUserDetailSchema>;
export type UpdateEmailInput = z.infer<typeof updateEmailSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
export type UpdateProfileUrlInput = z.infer<typeof updateProfileUrl>;
