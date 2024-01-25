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
    const session = await db.sessionExam.create({
      data: {
        type,
        dateDebut,
        dateFin,
      },
    });

    return NextResponse.json(session);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }
    return new NextResponse("Could not create ExamSession", { status: 500 });
  }
}
