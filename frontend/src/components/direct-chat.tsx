import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import axiosInstance from "@/api";
import { AxiosError } from "axios";
import { directChatSchema, type ParticipantIDType } from "@/schema";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type DirectChatProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export type SearchUser = {
  id: string;
  email: string;
  username: string;
  userDetail: {
    displayName: string | null;
    profileUrl: string | null;
  } | null;
};

// FIX: Check it is working or not
export function DirectChat({ open, setOpen }: DirectChatProps) {
  const { user } = useAuth();
  const [participant, setParticipant] = useState<ParticipantIDType>("");
  const [isLoading, SetIsLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [openSearch, setOpenSearch] = useState<boolean>(false);

  const fetchUsers = async (keyword: string) => {
    SetIsLoading(true);
    try {
      console.log(query);
      const response = await axiosInstance.get(
        `/users?keyword=${keyword}&page=${page}&limit=${limit}`
      );

      if (response.status !== 200) {
        toast.error("Failed to fetch the users");
        return;
      }

      console.log("Search response: ", response);

      setUsers(response.data.data);
      // set up the pages and limit and total pages
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      SetIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!query.trim()) {
        return;
      }

      fetchUsers(query);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query, page, limit]);

  const onCreate = async () => {
    const payload = {
      type: "direct",
      participants: [user?.id, participant],
    };

    const parsedValue = z.safeParse(directChatSchema, payload);
    if (!parsedValue.success) {
      toast.error(parsedValue.error.message);
      return;
    }

    try {
      const response = await axiosInstance.post("/chat", parsedValue.data);
      toast.success(response.data.message);
      setOpen(false);
    } catch (error) {
      const err = error as AxiosError;
      const errMsg =
        (err.response?.data as any).message ?? "Something went wrong";
      toast.error(errMsg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>One-on-One chat</DialogTitle>
          <DialogDescription>
            Create a 1:1 chat with any participant here.
          </DialogDescription>
        </DialogHeader>
        <div className="">
          <Popover open={openSearch} onOpenChange={setOpenSearch}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openSearch}
                className="w-full justify-between"
              >
                {participant
                  ? users.find((u) => u.id === participant)?.userDetail
                      ?.displayName || query
                  : "Select participant..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command className="w-full">
                <CommandInput
                  placeholder="Search participant..."
                  className="w-full h-9"
                  value={query}
                  onValueChange={(value) => setQuery(value)}
                />
                <CommandList>
                  {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                  {!isLoading && users.length === 0 && (
                    <CommandEmpty>No Participant found.</CommandEmpty>
                  )}
                  <CommandGroup>
                    {users.map((u) => (
                      <CommandItem
                        key={u.id}
                        value={u.id}
                        onSelect={() => {
                          setParticipant(u.id);
                          setQuery(u.userDetail?.displayName ?? "");
                          setOpenSearch(false);
                        }}
                      >
                        {u.userDetail?.displayName || u.username}
                        <Check
                          className={cn(
                            "ml-auto",
                            participant === u.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={onCreate} disabled={!participant}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
