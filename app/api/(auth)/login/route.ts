import { LoginSchema } from "@/lib/validator";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = LoginSchema.parse(body);

    console.log("=>  POST  { email, password }:", { email, password });

    return NextResponse.json({ success: "login success" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid fields" });
    }
    return new NextResponse("Could not signed in" + error, {
      status: 500,
    });
  }
}
