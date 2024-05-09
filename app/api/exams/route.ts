import { getLocationsForExam } from "@/data/exam";
import db from "@/lib/db";
import { ExamSchemaApi } from "@/lib/validator";
import { NextResponse } from "next/server";
import { z } from "zod";
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
      locations,
      manual,
    } = ExamSchemaApi.parse(body);
    let examRooms: number[] = [];
    let studentsRemaining: number = 0;
    if (manual) {
      examRooms = locations;
    } else {
      const { rooms, remainingStudent } = await getLocationsForExam(
        timeSlotId,
        enrolledStudentsCount
      );
      examRooms = rooms;
      studentsRemaining = remainingStudent;
    }

    if (studentsRemaining > 0) {
      return NextResponse.json({
        error: "nombre de locaux insuffisant pour passer l'examen",
      });
    }
    const selectedTimeSlot = await db.timeSlot.findFirst({
      where: { id: timeSlotId },
    });

    const nextTimeSlot = await db.timeSlot.findFirst({
      where: {
        dayId: selectedTimeSlot?.dayId,
        timePeriod: selectedTimeSlot?.timePeriod,
        NOT: { id: timeSlotId },
      },
    });
    if (nextTimeSlot) {
      await db.exam.create({
        data: {
          moduleName: "",
          options: "",
          enrolledStudentsCount: 0,
          timeSlotId: nextTimeSlot?.id,
          responsibleId: responsibleId,
          Monitoring: {
            create: [
              {
                locationId: null,
                monitoringLines: { create: [{ teacherId: responsibleId }] },
              },
            ],
          },
        },
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
                locationId: room,
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
