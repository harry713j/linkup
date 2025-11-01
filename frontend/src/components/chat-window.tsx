import axiosInstance from "@/api";
import { type PaginatedResponse, type Chat, type Message } from "@/types";
import type { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type ChatWindowProps = {
  chat: Chat | null;
};

// when this component loads, fetch the messages, all the events through sockets like typing etc,
// when click on seeing group about section there the group members should be shown(participant id, name, username, icon)

export function ChatWindow({ chat }: ChatWindowProps) {
  const [data, setData] = useState<PaginatedResponse<Message> | null>(null);
  const [messages, setMessages] = useState<Message[] | undefined>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchMessages = useCallback(async () => {
    if (!chat) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/chats/${chat.id}/messages`);
      setData(response.data.data);
      setMessages(data?.data);
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

  return <div>Chat Window</div>;
}
