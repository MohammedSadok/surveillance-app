import db from "@/lib/prismadb";
import { DepartementSchema } from "@/lib/validator";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { departmentId: string } }
) {
  try {
    const teachers = await db.enseignant.findMany({
      where: {
        departementId: parseInt(params.departmentId),
      },
    });
    return NextResponse.json(teachers);
  } catch {
    return new NextResponse("Could not get Departements", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { departementId: string } }
) {
  try {
    if (!params.departementId) {
      return new NextResponse("Session id is required", { status: 400 });
    }
    const exam = await db.departement.delete({
      where: {
        id: parseInt(params.departementId),
      },
    });
    return NextResponse.json(exam);
  } catch (error) {
    console.log("[DEPARTEMENT_DELETE]", error);
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
    const { nom } = DepartementSchema.parse(body);
    const exam = await db.departement.update({
      where: {
        id: parseInt(params.departmentId),
      },
      data: {
        nom,
      },
    });
    return NextResponse.json(exam);
  } catch (error) {
    console.log("[DEPARTMENT_UPDATE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
