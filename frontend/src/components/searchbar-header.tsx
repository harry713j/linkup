import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EllipsisVertical, LogOut, User, Users } from "lucide-react";
import axiosInstance from "@/api";
import { AxiosError } from "axios";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export function HeaderSearchbar() {
  const [openOne, setOpenOne] = useState<boolean>(false);
  const [openGroup, setOpenGroup] = useState<boolean>(false);
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
              <Button variant="ghost" onClick={onLogout}>
                <LogOut /> Logout
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Dialog open={openOne} onOpenChange={setOpenOne}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4"></div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={openGroup} onOpenChange={setOpenGroup}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4"></div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
