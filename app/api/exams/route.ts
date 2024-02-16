import { getLocationsForExam } from "@/data/exam";
import db from "@/lib/db";
import { ExamSchemaApi } from "@/lib/validator";
import { NextResponse } from "next/server";
import { z } from "zod";

// export async function GET() {
//   try {
//     // const exams = await db.exam.findMany();
//     const days = await db.day.findMany({
//       where: {
//         sessionExamId: 1,
//       },
//       orderBy: {
//         date: "asc",
//       },
//       include: {
//         timeSlot: true,
//       },
//     });
//     const monitoringDaysPromises = days.map(async (day) => {
//       return await db.monitoring.findMany({
//         where: { exam: { TimeSlot: { dayId: day.id } } },
//         include: {
//           exam: { include: { moduleResponsible: true } },
//           location: true,
//           monitoringLines: { include: { teacher: true } },
//         },
//       });
//     });

//     // Wait for all promises to resolve
//     const monitoringDays = await Promise.all(monitoringDaysPromises);
//     const formatted = monitoringDays.map((day) =>
//       day.map((line) => {
//         return {
//           line.location ?
//           module: line.exam.moduleName,
//           responsible: line.exam.moduleResponsible.lastName,
//           monitoring: {
//             location: line.location?.name,
//             monitoringLines: line.monitoringLines,
//           },
//         };
//       })
//     );

//     return NextResponse.json(formatted);
//   } catch {
//     return new NextResponse("Could not get exams", { status: 500 });
//   }
// }

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      moduleName,
      options,
      responsibleId,
      enrolledStudentsCount,
      timeSlotId,
      students,
    } = ExamSchemaApi.parse(body);

    const { examRooms, remainingStudent } = await getLocationsForExam(
      timeSlotId,
      enrolledStudentsCount
    );

    if (remainingStudent > 0) {
      return NextResponse.json({
        error: "nombre de locaux insuffisant pour passer l'examen",
      });
    }

    const exam = await db.exam.create({
      data: {
        moduleName,
        options,
        enrolledStudentsCount,
        timeSlotId,
        responsibleId,
        students: { create: students },
        Monitoring: {
          create: [
            {
              locationId: null,
              monitoringLines: { create: [{ teacherId: responsibleId }] },
            },

            ...examRooms.flatMap((room, index) => {
              return {
                locationId: room.id,
              };
            }),
          ],
        },
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
