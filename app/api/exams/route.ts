import { getLocationsForExam, getTeachersForExam } from "@/data/exam";
import db from "@/lib/db";
import { ExamSchema } from "@/lib/validator";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {
  const rooms = await getLocationsForExam(1, 181);
  return NextResponse.json(rooms);
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

    const { examRooms, remainingStudent } = await getLocationsForExam(
      timeSlotId,
      enrolledStudentsCount
    );
    const teachers = await getTeachersForExam(
      timeSlotId,
      responsibleId,
      examRooms
    );

    if (remainingStudent > 0) {
      return NextResponse.json({
        error: "nombre de locaux insuffisant pour passer l'examen",
      });
    }

    let neededTeacherNumber = 0;
    examRooms.forEach((location) => {
      neededTeacherNumber += location.type === "AMPHITHEATER" ? 3 : 2;
    });

    if (neededTeacherNumber >= teachers.length) {
      return NextResponse.json({
        error: "nombre des enseignant insuffisant pour passer l'examen",
      });
    }

    const neededTeacher = teachers.slice(0, neededTeacherNumber);
    let teacherIndex = 0;
    const exam = await db.exam.create({
      data: {
        moduleName,
        options,
        enrolledStudentsCount,
        timeSlotId,
        responsibleId,
        Monitoring: {
          create: [
            {
              locationId: null,
              monitoringLines: { create: [{ teacherId: responsibleId }] },
            },

            ...examRooms.flatMap((room, index) => {
              const numTeachers = room.type === "AMPHITHEATER" ? 3 : 2;
              const monitoringLines = [];

              for (let i = 0; i < numTeachers; i++, teacherIndex++) {
                monitoringLines.push({
                  teacherId: neededTeacher[teacherIndex].id,
                });
                console.log(teacherIndex);
              }

              return {
                locationId: room.id,
                monitoringLines: {
                  create: monitoringLines,
                },
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
