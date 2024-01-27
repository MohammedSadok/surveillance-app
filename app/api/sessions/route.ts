import { day } from "@/constants";
import db from "@/lib/prismadb";
import { SessionSchema } from "@/lib/validator";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
  try {
    const sessions = await db.sessionExam.findMany({
      orderBy: { dateDebut: "desc" },
    });
    return NextResponse.json(sessions);
  } catch {
    return new NextResponse("Could not get ExamSessions", { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, dateDebut, dateFin } = SessionSchema.parse({
      ...body,
      dateDebut: new Date(body.dateDebut),
      dateFin: new Date(body.dateFin),
    });

    const differenceInDays = Math.floor(
      (dateFin.getTime() - dateDebut.getTime()) / (1000 * 3600 * 24)
    );
    const createdSession = await db.sessionExam.create({
      data: {
        type,
        dateDebut,
        dateFin,
        Journee: {
          createMany: {
            data: Array.from({ length: differenceInDays + 1 }).map(
              (_, index) => ({
                date: new Date(dateDebut.getTime() + index * 24 * 3600 * 1000),
              })
            ),
          },
        },
      },
      include: {
        Journee: true,
      },
    });
    for (const journee of createdSession.Journee) {
      await db.creneau.createMany({
        data: day.flatMap((scheduleItem) =>
          Object.entries(scheduleItem).flatMap(([periode, slots]) =>
            slots.map((slot) => ({
              heureDebut: slot.split(" - ")[0],
              heureFin: slot.split(" - ")[1],
              journeeId: journee.id,
            }))
          )
        ),
      });
    }

    return NextResponse.json(createdSession);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }
    return new NextResponse("Could not create ExamSession " + error, {
      status: 500,
    });
  }
}
