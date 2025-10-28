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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import axiosInstance from "@/api";
import { AxiosError } from "axios";
import { groupChatSchema, type GroupChatSchema } from "@/schema";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SearchUser } from "./direct-chat";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type GroupChatProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

// FIX: Check it is working or not
export function GroupChat({ open, setOpen }: GroupChatProps) {
  const { user } = useAuth();
  const [isLoading, SetIsLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const form = useForm<GroupChatSchema>({
    resolver: zodResolver(groupChatSchema),
    defaultValues: {
      type: "group",
      adminId: user?.id,
      name: "",
      participants: user?.id ? [user?.id] : [],
    },
  });

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
      const err = error as AxiosError;
      const errMsg =
        (err.response?.data as any).message ?? "Something went wrong";
      toast.error(errMsg);
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

  const onCreate = async (data: GroupChatSchema) => {
    console.log("Group chat payload: ", data);
    try {
      const response = await axiosInstance.post("/chat", data);
      toast.success(response.data.message);
      setOpen(false);
    } catch (error) {
      const err = error as AxiosError;
      const errMsg =
        (err.response?.data as any).message ?? "Something went wrong";
      toast.error(errMsg);
    }
  };

  const removeParticipants = (id: string) => {
    const current = form.getValues("participants");
    form.setValue(
      "participants",
      current.filter((p) => p !== id)
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Group Chat</DialogTitle>
          <DialogDescription>
            Create a group chat with any participants here.
          </DialogDescription>
        </DialogHeader>
        <div className="">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onCreate)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Gryffindor Lads" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="participants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Participants</FormLabel>
                    <Popover open={openSearch} onOpenChange={setOpenSearch}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openSearch}
                            className="w-full justify-between"
                          >
                            Select participants...
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
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
                            {isLoading && (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            )}
                            {!isLoading && users.length === 0 && (
                              <CommandEmpty>No Participant found.</CommandEmpty>
                            )}
                            <CommandGroup>
                              {users.map((u) => {
                                const selected = field.value.includes(u.id);
                                return (
                                  <CommandItem
                                    key={u.id}
                                    value={u.id}
                                    onSelect={() => {
                                      if (!selected) {
                                        form.setValue("participants", [
                                          ...form.getValues("participants"),
                                          u.id,
                                        ]);
                                      }

                                      setQuery("");
                                      setOpenSearch(false);
                                    }}
                                  >
                                    {u.userDetail?.displayName || u.username}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        selected ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {field.value.length > 1 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {field.value
                          .filter((id) => id !== user?.id)
                          .map((id) => {
                            const u = users.find((u) => u.id === id);
                            return (
                              <Badge
                                key={id}
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                {u?.userDetail?.displayName ||
                                  u?.username ||
                                  id}
                                <button
                                  type="button"
                                  onClick={() => removeParticipants(id)}
                                  className="ml-1 rounded-full hover:bg-muted p-0.5"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            );
                          })}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={
                    form.getValues("participants").length < 2 &&
                    form.getValues("name") === ""
                  }
                >
                  Create
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
