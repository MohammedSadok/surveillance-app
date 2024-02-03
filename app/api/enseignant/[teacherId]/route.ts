import db from "@/lib/prismadb";
import { EnseignantSchema } from "@/lib/validator";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { teacherId: string } }
) {
  try {
    if (!params.teacherId) {
      return new NextResponse("Session id is required", { status: 400 });
    }
    const exam = await db.enseignant.delete({
      where: {
        id: parseInt(params.teacherId),
      },
    });
    return NextResponse.json(exam);
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
    const { nom, departementId, e_mail, numero_tel, prenom } =
      EnseignantSchema.parse(body);
    const teacher = await db.enseignant.update({
      where: {
        id: parseInt(params.teacherId),
      },
      data: {
        nom,
        prenom,
        departementId,
        e_mail,
        numero_tel,
      },
    });
    return NextResponse.json(teacher);
  } catch (error) {
    console.log("[DEPARTMENT_UPDATE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
