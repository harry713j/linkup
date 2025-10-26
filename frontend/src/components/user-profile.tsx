import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type UserProfileProps = {
  username: string;
  email: string;
  displayName: string;
  profilePictureUrl?: string;
  bio?: string;
  status?: boolean;
  className?: string;
};

// TODO: FIX all the update user details

export function UserProfile(props: UserProfileProps) {
  return (
    <div className="border-t border-t-slate-300 px-4 py-2">
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex items-center gap-2">
            <div className="w-1/3 ">
              {props.profilePictureUrl ? (
                <span className="w-12 h-12 rounded-full">
                  <img
                    src={props.profilePictureUrl}
                    alt="profile-pic"
                    className="w-full object-cover"
                  />
                </span>
              ) : (
                <span className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-800">
                  <p className="text-2xl font-semibold text-slate-200">
                    {props.displayName?.slice(0, 1).toUpperCase()}
                  </p>
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
          <DialogHeader></DialogHeader>
          <div className="w-full flex items-center justify-around">
            <div className="w-1/2">
              {props.profilePictureUrl ? (
                <div className="w-24 h-24 rounded-full flex items-center justify-center">
                  <img
                    src={props.profilePictureUrl}
                    alt="profile-pic"
                    className="w-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full flex items-center justify-center bg-blue-700">
                  <p className="text-2xl font-semibold text-slate-200">
                    {props.displayName?.slice(0, 1).toUpperCase()}
                  </p>
                </div>
              )}
            </div>
            <div>
              <Input type="text" value={props.displayName} disabled={true} />
              <p>@{props.username}</p>
              <p>{props.email}</p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="destructive">Close</Button>
            </DialogClose>
            <Button>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
