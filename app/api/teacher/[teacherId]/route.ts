import db from "@/lib/prismadb";
import { TeacherSchema } from "@/lib/validator";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { teacherId: string } }
) {
  try {
    if (!params.teacherId) {
      return new NextResponse("Session id is required", { status: 400 });
    }
    const teacher = await db.teacher.delete({
      where: {
        id: parseInt(params.teacherId),
      },
    });
    return NextResponse.json(teacher);
  } catch (error) {
    console.log("[TEACHER_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { teacherId: string } }
) {
  try {
    if (!params.teacherId) {
      return new NextResponse("Local id is required", { status: 400 });
    }
    const body = await req.json();
    const { firstName, lastName, phoneNumber, email, departmentId } =
      TeacherSchema.parse(body);
    const teacher = await db.teacher.update({
      where: {
        id: parseInt(params.teacherId),
      },
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
    console.log("[DEPARTMENT_UPDATE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
