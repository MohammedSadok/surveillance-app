import db from "@/lib/prismadb";
import { FiliereSchema } from "@/lib/validator";
import { NextResponse } from "next/server";
import { z } from "zod";

// export async function GET() {
//   try {
//     const sessions = await db.sessionExam.findMany({
//       orderBy: { dateDebut: "desc" },
//     });
//     return NextResponse.json(sessions);
//   } catch {
//     return new NextResponse("Could not get ExamSessions", { status: 500 });
//   }
// }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nom, departementId } = FiliereSchema.parse(body);
    const filiere = await db.filiere.create({
      data: {
        nom,
        departementId,
      },
    });

    return NextResponse.json(filiere);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }
    return new NextResponse("Could not create Filiere " + error, {
      status: 500,
    });
  }
}
