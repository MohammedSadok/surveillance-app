import db from "@/lib/db";
import { DepartmentSchema } from "@/lib/validator";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { departmentId: string } }
) {
  try {
    const teachers = await db.teacher.findMany({
      where: {
        departmentId: parseInt(params.departmentId),
      },
    });
    return NextResponse.json(teachers);
  } catch {
    return new NextResponse("Could not get Departments", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { departmentId: string } }
) {
  try {
    if (!params.departmentId) {
      return new NextResponse("Department id is required", { status: 400 });
    }
    const department = await db.department.delete({
      where: {
        id: parseInt(params.departmentId),
      },
    });
    return NextResponse.json(department);
  } catch (error) {
    console.log("[DEPARTMENT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { departmentId: string } }
) {
  try {
    if (!params.departmentId) {
      return new NextResponse("Local id is required", { status: 400 });
    }
    const body = await req.json();
    const { name } = DepartmentSchema.parse(body);
    const exam = await db.department.update({
      where: {
        id: parseInt(params.departmentId),
      },
      data: {
        name,
      },
    });
    return NextResponse.json(exam);
  } catch (error) {
    console.log("[DEPARTMENT_UPDATE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
