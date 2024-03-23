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

    const selectedTimeSlot = await db.timeSlot.findFirst({
      where: { id: exam.timeSlotId },
    });

    const nextTimeSlot = await db.timeSlot.findFirst({
      where: {
        dayId: selectedTimeSlot?.dayId,
        timePeriod: selectedTimeSlot?.timePeriod,
        NOT: { id: exam.timeSlotId },
      },
    });
    await db.exam.deleteMany({
      where: {
        moduleName: "",
        responsibleId: exam.responsibleId,
        timeSlotId: nextTimeSlot?.id,
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
