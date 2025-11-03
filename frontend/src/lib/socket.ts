import { io, Socket } from "socket.io-client";
import { getAccessToken } from "@/api";
import { config } from "@/config";

let socket: Socket | null = null;

export async function getSocket(): Promise<Socket> {
  if (socket && socket.connected) {
    return socket;
  }

  const token = getAccessToken();

  if (!token) {
    throw new Error("No Jwt token");
  }

  socket = io(config.apiBaseUrl, {
    autoConnect: false,
    auth: {
      token: token,
    },
    timeout: 5000,
    transports: ["websocket", "polling"],
  });

  return socket;
}
