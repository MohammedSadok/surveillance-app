import db from "@/lib/prismadb";
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
