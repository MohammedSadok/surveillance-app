import { getUserByEmail } from "@/data/user";
import db from "@/lib/db";
import { RegisterSchema } from "@/lib/validator";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
export async function GET() {
  try {
    const users = await db.user.findMany();
    return NextResponse.json(users);
  } catch {
    return new NextResponse("Could not get Users", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, isAdmin } = RegisterSchema.parse(body);
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw new Error("Email already in use !");
    }
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isAdmin,
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }
    return new NextResponse("Could not create User " + error, {
      status: 500,
    });
  }
}
