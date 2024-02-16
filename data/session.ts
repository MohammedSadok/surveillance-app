"use server";
import db from "@/lib/db";
import { getTeachersForExam } from "./exam";

export const getMonitoring = async (
  departmentId: number,
  sessionId?: number
) => {
  const teacherMonitoring = await db.teacher.findMany({
    include: {
      monitoringLines: {
        include: { monitoring: { include: { exam: true, location: true } } },
      },
    },
    where:
      departmentId === 0
        ? {
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
          }
        : {
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

export const validateSession = async (sessionId: number) => {
  const timeSlots = await db.timeSlot.findMany({
    where: {
      day: { sessionExamId: sessionId },
    },

    include: {
      Exam: { include: { Monitoring: { include: { location: true } } } },
    },
  });

  for (const timeSlot of timeSlots) {
    for (const exam of timeSlot.Exam) {
      for (const monitoring of exam.Monitoring) {
        if (monitoring.locationId) {
          const freeTeacherIds = await getTeachersForExam(timeSlot.id);
          const neededTeacherNumber =
            monitoring.location?.type === "AMPHITHEATER" ? 3 : 2;
          const neededTeachers = freeTeacherIds
            .slice(0, neededTeacherNumber)
            .map((id) => ({
              teacherId: id,
            }));

          for (const neededTeacher of neededTeachers) {
            await db.monitoringLine.create({
              data: {
                teacher: {
                  connect: { id: neededTeacher.teacherId },
                },
                monitoring: {
                  connect: { id: monitoring.id },
                },
              },
            });
          }
        }
      }
    }
  }

  return timeSlots;
};

export const cancelSession = async (sessionId: number) => {
  await db.monitoringLine.deleteMany({
    where: {
      AND: [
        {
          monitoring: {
            exam: { TimeSlot: { day: { sessionExamId: sessionId } } },
          },
        },
        { monitoring: { location: { isNot: null } } },
      ],
    },
  });
};
