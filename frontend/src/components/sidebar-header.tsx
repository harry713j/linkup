import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  EllipsisVertical,
  LogOut,
  User,
  Users,
  Lock,
  Mail,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { DirectChat } from "./direct-chat";
import { GroupChat } from "./group-chat";
import { EmailForm } from "./email-form";
import { PasswordForm } from "./password-form";

export function SidebarHeader() {
  const [openOne, setOpenOne] = useState<boolean>(false);
  const [openGroup, setOpenGroup] = useState<boolean>(false);
  const [openMail, setOpenMail] = useState<boolean>(false);
  const [openPassword, setOpenPassword] = useState<boolean>(false);
  const { logout } = useAuth();

  const onLogout = async () => {
    try {
      await logout();
    } catch (err) {
      toast.error("Failed to logout user");
    }
  };

  return (
    <div className="border-b border-b-slate-300 px-2 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-slate-500">LinkUp</h2>
      </div>
      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost">
              <EllipsisVertical />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-fit">
            <div className="w-full flex flex-col items-start">
              <Button variant="ghost" onClick={() => setOpenOne(true)}>
                <User /> Create Chat
              </Button>
              <Button variant="ghost" onClick={() => setOpenGroup(true)}>
                <Users />
                Create Group
              </Button>
              <Button variant="ghost" onClick={() => setOpenMail(true)}>
                <Mail /> Change Email
              </Button>
              <Button variant="ghost" onClick={() => setOpenPassword(true)}>
                <Lock /> Change Password
              </Button>
              <Button variant="ghost" onClick={onLogout}>
                <LogOut /> Logout
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <DirectChat open={openOne} setOpen={setOpenOne} />
        <GroupChat open={openGroup} setOpen={setOpenGroup} />
        <EmailForm open={openMail} setOpen={setOpenMail} />
        <PasswordForm open={openPassword} setOpen={setOpenPassword} />
      </div>
    </div>
  );
}
