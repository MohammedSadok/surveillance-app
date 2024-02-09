import { getLocationsForExam, getTeachersForExam } from "@/data/exam";
import db from "@/lib/db";
import { ExamSchema } from "@/lib/validator";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET() {}

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
    const rooms = await getLocationsForExam(timeSlotId, enrolledStudentsCount);
    const teachers = await getTeachersForExam(
      timeSlotId,
      rooms.length,
      responsibleId
    );
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
            ...rooms.flatMap((room, index) => [
              {
                locationId: room.locationId,
                monitoringLines: {
                  create: [
                    { teacherId: teachers[index * 2].id },
                    { teacherId: teachers[index * 2 + 1].id },
                  ],
                },
              },
            ]),
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
