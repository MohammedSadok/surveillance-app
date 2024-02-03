import db from "@/lib/db";
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

  const surveillance = await db.monitoring.findMany({
    include: {
      teachers: true,
      // examen: { include: { Creneau: true } },
      location: true,
    },
    where: { exam: { timeSlotId: 1 } },
  });
  const occupiedTeacherIds = surveillance.flatMap((item) =>
    item.teachers.map((teacher) => teacher.id)
  );

  const freeTeachers = await db.teacher.findMany({
    where: {
      id: {
        notIn: occupiedTeacherIds,
      },
    },
  });
  const occupiedLocations = await db.monitoring.findMany({
    where: {
      exam: { timeSlotId: 1 },
    },
    select: { id: true },
  });
  const occupiedLocationsIds = occupiedLocations.map((local) => local.id);
  const freeLocations = await db.location.findMany({
    where: {
      id: {
        notIn: occupiedLocationsIds,
      },
    },
  });
  return NextResponse.json({ surveillance, freeTeachers, freeLocations });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      moduleName,
      options,
      responsibleId,
      enrolledStudentsCount,
      timeSlotId,
    } = ExamSchema.parse(body);
    const exam = await db.exam.create({
      data: {
        moduleName,
        options,
        responsibleId,
        enrolledStudentsCount,
        timeSlotId,
      },
    });

    return NextResponse.json(exam);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }
    return new NextResponse("Could not create Exam " + error, {
      status: 500,
    });
  }
}
