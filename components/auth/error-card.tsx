import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { Poppins } from "next/font/google";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export const ErrorCard = () => {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <div className="w-full flex flex-col gap-y-4 items-center justify-center">
          <h1 className={cn("text-3xl font-semibold", font.className)}>
            🔐 Auth Error
          </h1>
          <p className="text-muted-foreground text-sm">
            Oops! Something went wrong!
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full flex justify-center items-center">
          <ExclamationTriangleIcon className="text-destructive" />
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
