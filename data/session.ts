"use server";
import db from "@/lib/db";

export const getMonitoring = async (
  departmentId: number,
  sessionId: number
) => {
  const teacherMonitoring = await db.teacher.findMany({
    include: {
      monitoringLines: {
        include: { monitoring: { include: { exam: true, location: true } } },
      },
    },
    where: {
      departmentId: departmentId,
      monitoringLines: {
        some: {
          monitoring: {
            exam: {
              TimeSlot: {
                day: {
                  sessionExam: {
                    id: sessionId,
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  return teacherMonitoring;
};
