import { days } from "@/constants";
import db from "@/lib/db";
import { SessionSchema } from "@/lib/validator";
import { NextResponse } from "next/server";
import { z } from "zod";
export async function GET() {
  try {
    const sessions = await db.sessionExam.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(sessions);
  } catch {
    return new NextResponse("Could not get ExamSessions", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, endDate, startDate } = SessionSchema.parse({
      ...body,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
    });

    const differenceInDays = Math.floor(
      (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
    );
    const createdSession = await db.sessionExam.create({
      data: {
        type,
        startDate: startDate,
        endDate: endDate,
        day: {
          createMany: {
            data: Array.from({ length: differenceInDays + 1 }).map(
              (_, index) => ({
                date: new Date(startDate.getTime() + index * 24 * 3600 * 1000),
              })
            ),
          },
        },
      },
      include: {
        day: true,
      },
    });
    for (const day of createdSession.day) {
      await db.timeSlot.createMany({
        data: days.flatMap((scheduleItem) =>
          Object.entries(scheduleItem).flatMap(([time, slots]) =>
            slots.map((slot) => ({
              startTime: slot.split(" - ")[0],
              endTime: slot.split(" - ")[1],
              dayId: day.id,
            }))
          )
        ),
      });
    }

    return NextResponse.json("hello");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }
    return new NextResponse("Could not create ExamSession " + error, {
      status: 500,
    });
  }
}
