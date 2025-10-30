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
} from "@/components";
import axiosInstance from "@/api";
import { useCallback, useEffect, useState } from "react";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import type { ChatCardType } from "@/types";

// sidebar to show all the chats user in
// search bar to search for user or

export default function Chat() {
  const { loading, user } = useAuth();
  const [allChats, setAllChats] = useState<ChatCardType[]>([]);

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

  useEffect(() => {
    fetchAllChats();
  }, [user, fetchAllChats]);

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
          <ActiveChats chats={allChats} />
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
      <div>{/** Sidebar content */}</div>
    </SidebarProvider>
  );
}
