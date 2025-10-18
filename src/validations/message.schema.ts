import * as z from "zod"

export const messageTypeSchema = z.enum(["text", "image", "video", "file"], { error: "Message must be a type of text, image, video or file" })

export const messageSchema = z.object({
    chatId: z.uuid({ error: "Chat id is required for sending the message" }),
    senderId: z.uuid({ error: "Sender id is required for sending the message" }),
    content: z.string().optional(),
    attachmentUrl: z.union([z.url(), z.literal("")], { error: "Attachment url must be an url or empty" }).optional(),
    messageType: messageTypeSchema
})

export const messageStateType = z.enum(["sent", "delivered", "seen"], { error: "Message state must be a type of sent, delivered or seen" })

export const messageStatusSchema = z.object({
    messageId: z.bigint({ error: "Message is required" }),
    userId: z.uuid({ error: "User id is required" }),
    status: messageStateType
})

export type MessageType = z.infer<typeof messageTypeSchema>
export type CreateMessageInput = z.infer<typeof messageSchema>
export type MessageState = z.infer<typeof messageStateType>
export type MessageStatusInput = z.infer<typeof messageStatusSchema>