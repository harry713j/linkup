import { Socket } from "socket.io";
import { io } from "../app.js";
import { CreateMessageInput } from "@/validations/message.schema.js";
import { messageService } from "@/services/message.service.js";
import { userService } from "@/services/user.service.js";
import { verifySocketToken } from "@/middlewares/socket.middleware.js";

io.use(verifySocketToken);

io.on("connection", (socket: Socket) => {
  console.log("Connection established with ", socket.id);
  // change user online status
  // join all the chats
  socket.on("join_chats", async ({ chatIds }: { chatIds: string[] }) => {
    socket.join(chatIds);
    const userId = socket?.userId;
    await userService.update(userId as string, { status: true });
  });
  // listen to user send message
  socket.on("send_message", async (payload: CreateMessageInput) => {
    // save it to db and then broadcast to the intended chat
    messageService
      .create(payload.senderId, payload)
      .then((value) => io.to(value.chatID).emit("new_message", value))
      .catch(() => io.emit("error", "Unable to send the message"));
  });

  socket.on("disconnect", async () => {
    console.log("User disconnected");
    await userService.update("userId", { status: false });
  });
});
