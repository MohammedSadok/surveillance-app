import { getUserByEmail } from "@/data/user";
import db from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { RegisterSchema } from "@/lib/validator";
import bcrypt from "bcryptjs";
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

    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return NextResponse.json({ success: "Confirmation email send" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid fields" });
    }
    return new NextResponse("Could not signed in" + error, {
      status: 500,
    });
  }
}
