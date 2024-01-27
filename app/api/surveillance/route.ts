import db from "@/lib/prismadb";
import { NextResponse } from "next/server";

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

// const exam = await db.examen.create({
//   data: {
//     filieres: "SMI",
//     nombreDetudiantInscrit: 150,
//     nomDeModule: "Math",
//     creneauId: 1,
//     enseignantId: 1,
//   },
// });
