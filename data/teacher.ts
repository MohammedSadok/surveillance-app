"use server";
import db from "@/lib/db";

export const getFreeTeachersByDepartment = async (
  departmentId: number,
  timeSlotId: number
) => {
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
  return freeTeachers;
};
