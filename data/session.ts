"use server";
import db from "@/lib/db";

export const getMonitoring = async (departmentId: number) => {
  const teacherMonitoring = db.teacher.findMany({
    include: {
      monitoringLines: {
        include: { monitoring: { include: { exam: true, location: true } } },
      },
    },
    where: { departmentId: departmentId },
  });
  return teacherMonitoring;
};
