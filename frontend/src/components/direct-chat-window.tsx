import axiosInstance from "@/api";
import { useAuth } from "@/context/AuthContext";
import {
  type PaginatedResponse,
  type Message,
  type ChatWindowProps,
} from "@/types";
import type { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// when this component loads, fetch the messages, all the events through sockets like typing etc,
// when click on seeing group about section there the group members should be shown(participant id, name, username, icon)

export function DirectChatWindow({ chat }: ChatWindowProps) {
  const { user } = useAuth();
  const [data, setData] = useState<PaginatedResponse<Message> | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchMessages = useCallback(async () => {
    if (!chat) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await axiosInstance.get<{
        message: string;
        data: PaginatedResponse<Message>;
      }>(`/chats/${chat.id}/messages`);

      setData(response.data.data);
      setMessages(data?.data ?? []);
    } catch (error) {
      const err = error as AxiosError;
      const errMsg =
        (err.response?.data as any).message || "Something went wrong";
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchMessages();
  }, [page, limit, fetchMessages]);

  if (!chat) {
    return (
      <div>
        <h1>Chat Not found</h1>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h2>{chat.participants.find((p) => p.id != user?.id)?.displayName}</h2>
      </div>
      <div>
        {isLoading ? (
          <Loader2 className="w-8 h-8 animate-spin" />
        ) : (
          messages.map((message) => <p key={message.id}>{message.content}</p>)
        )}
      </div>
    </div>
  );
}
