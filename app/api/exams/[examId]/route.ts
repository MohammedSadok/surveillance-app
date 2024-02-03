import db from "@/lib/prismadb";
import { ExamSchema } from "@/lib/validator";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { examId: string } }
) {
  try {
    if (!params.examId) {
      return new NextResponse("Session id is required", { status: 400 });
    }
    const exam = await db.examen.delete({
      where: {
        id: parseInt(params.examId),
      },
    });
    return NextResponse.json(exam);
  } catch (error) {
    console.log("[EXAM_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
export async function PATCH(
  req: Request,
  { params }: { params: { examId: string } }
) {
  try {
    if (!params.examId) {
      return new NextResponse("Local id is required", { status: 400 });
    }
    const body = await req.json();
    const { creneauId, filiers, nomDeModule, responsible, studentsNumber } =
      ExamSchema.parse(body);
    const exam = await db.examen.update({
      where: {
        id: parseInt(params.examId),
      },
      data: {
        creneauId,
        enseignantId: responsible,
        filieres: filiers,
        nomDeModule,
        nombreDetudiantInscrit: studentsNumber,
      },
    });
    return NextResponse.json(exam);
  } catch (error) {
    console.log("[EXAM_UPDATE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
