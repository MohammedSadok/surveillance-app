"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

import { cn } from "@/lib/utils";
import axios from "axios";
import { Poppins } from "next/font/google";
import { BeatLoader } from "react-spinners";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";
const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});
export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  useEffect(() => {
    const onSubmit = async () => {
      if (success || error) return;
      if (!token) {
        setError("Missing token!");
        return;
      }
      try {
        const response = await axios.post(`/api/new-verification/${token}`);
        setSuccess(response.data.success);
        setError(response.data.error);
      } catch (error) {
        setError("An error occurred while confirming verification.");
      }
    };

    onSubmit();
  }, [token, success, error]);

  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <div className="w-full flex flex-col gap-y-4 items-center justify-center">
          <h1 className={cn("text-3xl font-semibold", font.className)}>
            🔐 Confirming your verification
          </h1>
          <p className="text-muted-foreground text-sm">
            Oops! Something went wrong!
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full flex justify-center items-center">
          <div className="flex items-center w-full justify-center">
            {!success && !error && <BeatLoader />}
            <FormSuccess message={success} />
            {!success && <FormError message={error} />}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="link" className="font-normal w-full" size="sm" asChild>
          <Link href="/login">Back to login</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
