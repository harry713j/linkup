import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { getSocket } from "@/lib/socket";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useAuth();

  const socketInit = useCallback(async () => {
    try {
      const socket = await getSocket();
      setSocket(socket);
    } catch (error) {
      throw error;
    }
  }, [user]);

  useEffect(() => {
    socketInit();
  }, [user, socketInit]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  if (!SocketContext) {
    throw new Error("Use useSocket() function inside SocketContextProvider");
  }

  return useContext(SocketContext);
};
