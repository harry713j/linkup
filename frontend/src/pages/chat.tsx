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
import { UserProfile, HeaderSearchbar } from "@/components";

// sidebar to show all the chats user in
// search bar to search for user or
export default function Chat() {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <HeaderSearchbar />
        </SidebarHeader>
        <SidebarContent></SidebarContent>
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
      <SidebarTrigger />
      <div>{/** Sidebar content */}</div>
    </SidebarProvider>
  );
}
