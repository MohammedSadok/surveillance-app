import db from "@/lib/prismadb";
import { EnseignantSchema } from "@/lib/validator";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
  try {
    const enseignants = await db.enseignant.findMany();
    return NextResponse.json(enseignants);
  } catch {
    return new NextResponse("Could not get ExamSessions", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prenom, e_mail, numero_tel, nom, departementId } =
      EnseignantSchema.parse(body);
    const enseignant = await db.enseignant.create({
      data: {
        nom,
        prenom,
        e_mail,
        numero_tel,
        departementId,
      },
    });

    return NextResponse.json(enseignant);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }
    return new NextResponse("Could not create Enseignant " + error, {
      status: 500,
    });
  }
}
