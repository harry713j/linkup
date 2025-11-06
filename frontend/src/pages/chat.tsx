import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import {
  UserProfile,
  SidebarHeader as SidebarTop,
  ActiveChats,
  DirectChatWindow,
  GroupChatWindow,
} from "@/components";
import axiosInstance from "@/api";
import { useCallback, useEffect, useState } from "react";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import type { Chat, ChatCardType } from "@/types";

// sidebar to show all the chats user in
// search bar to search for user or

export default function Chat() {
  const { loading, user } = useAuth();
  const [allChats, setAllChats] = useState<ChatCardType[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAllChats = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/chats");
      setAllChats(response.data.chats);
    } catch (error) {
      const err = error as AxiosError;
      const errMsg =
        (err.response?.data as any).message || "Something went wrong";
      toast.error(errMsg);
    }
  }, [user]);

  const fetchSelectedChat = useCallback(async () => {
    if (!selectedChatId) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/chats/${selectedChatId}`);
      setSelectedChat(response.data.chat);
    } catch (error) {
      const err = error as AxiosError;
      const errMsg =
        (err.response?.data as any).message || "Something went wrong";
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, [selectedChatId]);

  useEffect(() => {
    fetchAllChats();
  }, [user, fetchAllChats]);

  useEffect(() => {
    fetchSelectedChat();
  }, [selectedChatId, fetchSelectedChat]);

  const getCurrentChatId = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="offcanvas">
        <SidebarHeader>
          <SidebarTop />
        </SidebarHeader>
        <SidebarContent>
          <ActiveChats chats={allChats} getCurrentChatId={getCurrentChatId} />
        </SidebarContent>
        <SidebarFooter>
          <UserProfile
            displayName={user?.userDetail.displayName as string}
            username={user?.username as string}
            bio={user?.userDetail.bio as string}
            profilePictureUrl={user?.userDetail.profileUrl as string}
            status={user?.userDetail.status as boolean}
          />
        </SidebarFooter>
      </Sidebar>
      <SidebarTrigger className="hidden" />
      <div>
        {!selectedChat ? (
          <div>
            <h1>No chat selected</h1>
          </div>
        ) : isLoading ? (
          <span>
            <Loader2 className="w-8 h-8 animate-spin" />
          </span>
        ) : selectedChat.type === "direct" ? (
          <DirectChatWindow chat={selectedChat} />
        ) : (
          <GroupChatWindow chat={selectedChat} />
        )}
      </div>
    </SidebarProvider>
  );
}
