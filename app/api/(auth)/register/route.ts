import { getUserByEmail } from "@/data/user";
import db from "@/lib/db";
import { RegisterSchema } from "@/lib/validator";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { z } from "zod";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = RegisterSchema.parse(body);
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser)
      return NextResponse.json({ error: "Email already in use !" });

    await db.user.create({
      data: { email, name, password: hashedPassword },
    });

    return NextResponse.json({ success: "User Created" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid fields" });
    }
    return new NextResponse("Could not signed in" + error, {
      status: 500,
    });
  }
}
