import { useState, type Dispatch, type SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/api";
import { updateEmailSchema } from "@/schema";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { Loader2 } from "lucide-react";

type EmailFormProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export function EmailForm({ open, setOpen }: EmailFormProps) {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useAuth();

  const onUpdate = async () => {
    const payload = {
      email: email,
    };

    const parsedValue = z.safeParse(updateEmailSchema, payload);
    if (!parsedValue.success) {
      toast.error(parsedValue.error.message);
      return;
    }

    if (parsedValue.data.email === user?.email) {
      toast.warning("Provided email is same as previous email");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.patch(
        "/users/me/email",
        parsedValue.data
      );
      toast.success(response.data.message);
      setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Email</DialogTitle>
          <DialogDescription>Update the email of the user</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 items-start">
          <Label htmlFor="email">
            New email not equal to "{user?.email ?? "old email"}"
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={onUpdate} disabled={!email}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
              </>
            ) : (
              "Update"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
