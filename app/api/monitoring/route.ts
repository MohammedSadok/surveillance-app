import { validateSession } from "@/data/session";
import { getFreeTeachersByDepartment } from "@/data/teacher";
import { NextResponse } from "next/server";
import { z } from "zod";

const freeTeachersSchema = z.object({
  departmentId: z.number(),
  timeSlotId: z.number(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const { departmentId, timeSlotId } = freeTeachersSchema.parse(body);

  const freeTeachers = await getFreeTeachersByDepartment(
    departmentId,
    timeSlotId
  );
  return NextResponse.json({ freeTeachers });
}


