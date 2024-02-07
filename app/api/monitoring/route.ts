import db from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const freeTeachersSchema = z.object({
  departmentId: z.number(),
  timeSlotId: z.number(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const { departmentId, timeSlotId } = freeTeachersSchema.parse(body);
  const teachersWithMonitoring = await db.teacher.findMany({
    where: {
      monitoringLines: {
        some: {
          monitoring: {
            exam: {
              timeSlotId: timeSlotId,
            },
          },
        },
      },
    },
  });
  const occupiedTeacherIds = teachersWithMonitoring.map(
    (teacher) => teacher.id
  );

  const freeTeachers = await db.teacher.findMany({
    where: {
      departmentId: departmentId,
      id: {
        notIn: occupiedTeacherIds,
      },
    },
  });
  // const occupiedLocations = await db.monitoring.findMany({
  //   where: {
  //     exam: { timeSlotId: 1 },
  //   },
  //   select: { id: true },
  // });
  // const occupiedLocationsIds = occupiedLocations.map((local) => local.id);
  // const freeLocations = await db.location.findMany({
  //   where: {
  //     id: {
  //       notIn: occupiedLocationsIds,
  //     },
  //   },
  // });
  return NextResponse.json({ freeTeachers });
}
