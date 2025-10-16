import * as z from "zod"

const chatTypeSchema = z.enum(["direct", "group"], { error: "Invalid chat type" })

export const chatSchema = z.object({
    name: z.string({ error: "Chat group name must be of type string" }).optional(),
    adminId: z.uuid({ error: "Invalid adminId type" }).optional(),
    groupIcon: z.union([z.url(), z.literal("")], { error: "Group icon must be an url" }).optional(),
    type: chatTypeSchema,
    participants: z.array(z.uuid(), { error: "Invalid Participants id" })
})

export const updateChatSchema = z.object({
    name: z.string({ error: "Chat group name must be of type string" }).optional(),
    adminId: z.uuid({ error: "Invalid adminId type" }).optional(),
    groupIcon: z.union([z.url(), z.literal("")], { error: "Group icon must be an url" }).optional(),
})


export type ChatType = z.infer<typeof chatTypeSchema>
export type CreateChatInput = z.infer<typeof chatSchema>
export type UpdateChatInput = z.infer<typeof updateChatSchema>