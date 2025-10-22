import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { registerSchema, type RegisterUser } from "@/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";

export default function Signup() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const { register } = useAuth();
  const form = useForm<RegisterUser>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: RegisterUser) => {
    setIsSubmitting(true);
    try {
      await register(values);
      navigate("/chat");
    } catch (error) {
      const err = error as AxiosError;

      if (err.response) {
        const errMsg =
          (err.response.data as any).message || "Something went wrong";
        toast.error(errMsg);
      } else if (err.request) {
        toast.error("No response from server, check network connection");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-blue-50/50">
      <Card className="w-1/3 px-6 py-8 flex flex-col items-start spay-6">
        <CardHeader className="w-full">
          <CardTitle className="text-3xl text-slate-600 font-semibold">
            Join LinkUp
          </CardTitle>
        </CardHeader>
        <CardContent className="w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Harry Potter" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="harrypotter@gryffindor.com"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>This is your Email.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="password..." {...field} />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span>
                    Please wait <Loader2 className="w-4 h-4 animate-spin" />
                  </span>
                ) : (
                  "Register"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-slate-500">
            Already joined <span className="">LinkUp</span>?{" "}
            <Link
              className="hover:underline text-blue-400 hover:decoration-blue-400"
              to={"/login"}
            >
              Log in{" "}
            </Link>{" "}
            here
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
