"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginSchema } from "@/lib/validator";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { z } from "zod";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";

const LoginForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with google provider"
      : "";
  const signIdWithGoogle = () => {
    signIn("google", {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    setError("");
    setSuccess("");
    try {
      const response = await axios.post("/api/login", values);
      if (response.data?.error) {
        setError(response.data.error);
      }
      if (response.data?.success) {
        setSuccess(response.data.success);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mot de passe</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder="******"
                    type="password"
                    autoCapitalize="none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button disabled={isLoading} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Se connecter avec l'email
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Ou continuer avec
          </span>
        </div>
      </div>

      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={signIdWithGoogle}
      >
        <FcGoogle className="h-5 w-5 mr-2" /> Google
      </Button>

      <div className=" flex justify-center text-sm">
        <Link
          className="bg-background px-2 text-muted-foreground hover:underline"
          href={"/register"}
        >
          Vous avez pas un compte ?
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
