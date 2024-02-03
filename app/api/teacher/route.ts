import db from "@/lib/prismadb";
import { TeacherSchema } from "@/lib/validator";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
  try {
    const teachers = await db.teacher.findMany();
    return NextResponse.json(teachers);
  } catch {
    return new NextResponse("Could not get ExamSessions", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, phoneNumber, email, departmentId } =
      TeacherSchema.parse(body);
    const teacher = await db.teacher.create({
      data: {
        firstName,
        lastName,
        phoneNumber,
        email,
        departmentId,
      },
    });

    return NextResponse.json(teacher);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }
    return new NextResponse("Could not create Teacher " + error, {
      status: 500,
    });
  }
}
