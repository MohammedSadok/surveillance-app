import db from "@/lib/prismadb";
import { ExamSchema } from "@/lib/validator";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
  // const enseignants = await db.enseignant.findMany({
  //   take: 4,
  // });
  // const createSurveillance = await db.surveillance.create({
  //   data: {
  //     examenId: 1,
  //     localId: 1,
  //     enseignants: {
  //       connect: enseignants.map((item) => ({
  //         id: item.id,
  //       })),
  //     },
  //   },
  // });

  // const locauxSurveilles = await db.surveillance.findMany({
  //   where: {
  //     examen: { Creneau: { id: 1 } },
  //   },
  //   select: {
  //     localId: true,
  //   },
  // });
  // const locauxDisponibles = await db.local.findMany({
  //   where: {
  //     id: {
  //       notIn: locauxSurveilles.map((surveillance) => surveillance.localId),
  //     },
  //   },
  // });

  const surveillance = await db.surveillance.findMany({
    include: {
      enseignants: true,
      // examen: { include: { Creneau: true } },
      local: true,
    },
    where: { examen: { creneauId: 1 } },
  });
  const occupiedTeacherIds = surveillance.flatMap((item) =>
    item.enseignants.map((teacher) => teacher.id)
  );

  const freeTeachers = await db.enseignant.findMany({
    where: {
      id: {
        notIn: occupiedTeacherIds,
      },
    },
  });
  const occupiedLocaux = await db.surveillance.findMany({
    where: {
      examen: { creneauId: 1 },
    },
    select: { id: true },
  });
  const occupiedLocauxIds = occupiedLocaux.map((local) => local.id);
  const freeLocaux = await db.local.findMany({
    where: {
      id: {
        notIn: occupiedLocauxIds,
      },
    },
  });
  return NextResponse.json({ surveillance, freeTeachers, freeLocaux });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { filiers, nomDeModule, responsible, studentsNumber, creneauId } =
      ExamSchema.parse(body);
    if (creneauId) {
      const exam = await db.examen.create({
        data: {
          filieres: filiers,
          nombreDetudiantInscrit: studentsNumber,
          nomDeModule: nomDeModule,
          creneauId,
          enseignantId: responsible,
        },
      });

      return NextResponse.json(exam);
    } else {
      throw new Error();
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }
    return new NextResponse("Could not create Exam " + error, {
      status: 500,
    });
  }
}
