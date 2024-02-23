import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { examId: string } }
) {
  try {
    if (!params.examId) {
      return new NextResponse("Session id is required", { status: 400 });
    }
    const exam = await db.exam.delete({
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

export async function GET(
  req: Request,
  { params }: { params: { examId: string } }
) {
  try {
    if (!params.examId) {
      return new NextResponse("Local id is required", { status: 400 });
    }
    const exam = await db.exam.findFirst({
      where: { id: parseInt(params.examId) },
      include: {
        moduleResponsible: true,
        TimeSlot: true,
        Monitoring: { include: { location: true } },
      },
    });
    return NextResponse.json(exam);
  } catch (error) {
    console.log("[EXAM_UPDATE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
