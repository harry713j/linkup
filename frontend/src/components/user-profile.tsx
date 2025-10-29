import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axiosInstance from "@/api";
import { updateUserDetailSchema } from "@/schema";
import { useState } from "react";
import { Pen, Loader2, PenOff } from "lucide-react";
import * as z from "zod";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { DialogDescription } from "@radix-ui/react-dialog";

type UserProfileProps = {
  username: string;
  displayName: string;
  profilePictureUrl?: string;
  bio?: string;
  status?: boolean;
  className?: string;
};

export function UserProfile(props: UserProfileProps) {
  const [editing, setEditing] = useState<boolean>(false);
  const [name, setName] = useState(props.displayName ?? "");
  const [bio, setBio] = useState(props?.bio ?? "");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onUpdate = async () => {
    const oldPayload = {
      displayName: props.displayName,
      bio: props?.bio,
      status: props?.status,
    };

    const newPayload = {
      displayName: name.trim(),
      bio: bio.trim(),
      status: true,
    };

    if (JSON.stringify(oldPayload) === JSON.stringify(newPayload)) {
      toast.warning("No change in values");
      return;
    }

    const parsedValue = z.safeParse(updateUserDetailSchema, newPayload);

    if (!parsedValue.success) {
      toast.error(parsedValue.error.message);
      return;
    }
    setIsLoading(true);
    try {
      const response = await axiosInstance.patch("/users/me", parsedValue.data);
      toast.success(response.data.message);
      setEditing(false);
    } catch (error) {
      const err = error as AxiosError;
      const errMsg =
        (err.response?.data as any).message || "Something went wrong";
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-t border-t-slate-300 px-4 py-2">
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex items-center gap-2">
            <div className="w-1/3 ">
              {props.profilePictureUrl ? (
                <span className="w-12 h-12 rounded-full relative">
                  <img
                    src={props.profilePictureUrl}
                    alt="profile-pic"
                    className="w-full object-cover"
                  />
                  <div
                    className={`absolute w-3 h-3 bottom-0 right-1 rounded-full ${props.status ? "bg-green-500" : "bg-red-500"} `}
                  ></div>
                </span>
              ) : (
                <span className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-800 relative">
                  <p className="text-2xl font-semibold text-slate-200">
                    {props.displayName?.slice(0, 1).toUpperCase()}
                  </p>
                  <div
                    className={`absolute w-3 h-3 bottom-0 right-1 rounded-full ${props.status ? "bg-green-500" : "bg-red-500"} `}
                  ></div>
                </span>
              )}
            </div>
            <div className="flex flex-col items-start gap-1">
              <h4 className="text-lg font-semibold text-slate-700">
                {props.displayName}
              </h4>
              <p className="text-sm text-slate-700/80">@{props.username}</p>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl text-slate-600">
              Profile Details
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="w-full flex items-start justify-around">
            <div className="w-1/3 flex flex-col items-start gap-1">
              {props.profilePictureUrl ? (
                <div className="w-20 h-20 rounded-full flex items-center justify-center relative">
                  <img
                    src={props.profilePictureUrl}
                    alt="profile-pic"
                    className="w-full object-cover"
                  />
                  <div
                    className={`absolute w-3.5 h-3.5 bottom-0 right-2 rounded-full ${props.status ? "bg-green-500" : "bg-red-500"} `}
                  ></div>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full flex items-center justify-center bg-blue-700 relative">
                  <p className="text-2xl font-semibold text-slate-200">
                    {props.displayName?.slice(0, 1).toUpperCase()}
                  </p>
                  <div
                    className={`absolute w-3.5 h-3.5 bottom-0 right-2 rounded-full ${props.status ? "bg-green-500" : "bg-red-500"} `}
                  ></div>
                </div>
              )}
              <p className="pt-1 pl-2 text-slate-600">@{props.username}</p>
            </div>
            <div className="w-2/3 flex flex-col items-start gap-4">
              {editing ? (
                <div className="relative w-full flex flex-col items-start gap-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="absolute -top-4 right-2"
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditing(false)}
                      >
                        <PenOff className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Disable editing</TooltipContent>
                  </Tooltip>

                  <span className="w-full flex flex-col items-start gap-1">
                    <Label htmlFor="displayName">Name</Label>
                    <Input
                      id="displayName"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </span>
                  <span className="w-full flex flex-col items-start gap-1">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Your Bio..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-start">
                  <span className="flex items-center gap-2">
                    <h2 className="text-xl font-medium text-slate-600">
                      {props.displayName}
                    </h2>
                    {!editing && (
                      <Button
                        variant="ghost"
                        onClick={() => setEditing(true)}
                        size="icon"
                      >
                        <Pen className="w-4 h-4" />
                      </Button>
                    )}
                  </span>
                  <span className="flex items-start gap-2">
                    <p className="text-slate-600">{props.bio}</p>
                  </span>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="destructive">Close</Button>
            </DialogClose>
            <Button onClick={onUpdate} disabled={isLoading}>
              {isLoading ? (
                <span>
                  <Loader2 className="w-4 h-5 animate-spin" />
                </span>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
