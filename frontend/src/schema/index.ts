import * as z from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .nonempty()
    .min(4, "Display name should have at least 4 characters")
    .max(30, "Display name shouldn't exceed 30 characters")
    .regex(
      /^[a-z0-9_]+$/,
      "Username can only contain lowercase letters, numbers, and underscores"
    ),
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

/** User details Schema */

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

/** Chat Schema */
const chatTypeSchema = z.enum(["direct", "group"], {
  error: "Invalid chat type",
});
const participantSchema = z.array(z.uuid(), {
  error: "Invalid Participants",
});

export const directChatSchema = z.object({
  type: chatTypeSchema.exclude(["group"]),
  participants: participantSchema.length(2, {
    error: "Only two participants are allowed in 1:1 chat",
  }),
});

export const groupChatSchema = z.object({
  name: z.string({ error: "Chat group name must be of type string" }),
  adminId: z.uuid({ error: "Invalid adminId type" }),
  // groupIcon: z
  //   .union([z.url(), z.literal("")], { error: "Group icon must be an url" })
  //   .optional(),
  type: chatTypeSchema.exclude(["direct"]),
  participants: participantSchema.min(2, {
    error: "At least one participants required for group chat",
  }),
});

export const updateGroupChatSchema = z.object({
  name: z
    .string({ error: "Chat group name must be of type string" })
    .optional(),
  adminId: z.uuid({ error: "Invalid adminId type" }).optional(),
  groupIcon: z
    .union([z.url(), z.literal("")], { error: "Group icon must be an url" })
    .optional(),
});

export const addGroupParticipantsSchema = z.object({
  participants: participantSchema,
});

const participantID = z.uuid();

export type ParticipantIDType = z.infer<typeof participantID>;
export type RegisterUser = z.infer<typeof registerSchema>;
export type LoginUser = z.infer<typeof loginSchema>;
export type ChatType = z.infer<typeof chatTypeSchema>;
export type DirectChatSchema = z.infer<typeof directChatSchema>;
export type GroupChatSchema = z.infer<typeof groupChatSchema>;
export type UpdateGroupChatSchema = z.infer<typeof updateGroupChatSchema>;
export type AddGroupParticipantsSchema = z.infer<
  typeof addGroupParticipantsSchema
>;
export type ParticipantId = z.infer<typeof participantSchema>;
