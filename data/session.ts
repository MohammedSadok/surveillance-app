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
  await db.sessionExam.update({
    where: { id: sessionId },
    data: { isValidated: true },
  });
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
  await db.sessionExam.update({
    where: { id: sessionId },
    data: { isValidated: false },
  });
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

export const getMonitoringDay = async (dayId: number) => {
  return await db.exam.findMany({
    where: { TimeSlot: { dayId: dayId } },
    include: {
      moduleResponsible: true,
      Monitoring: {
        include: {
          location: true,
          monitoringLines: { include: { teacher: true } },
        },
      },
    },
  });
};

export const deleteSession = async (sessionId: number) => {
  const session = await db.sessionExam.delete({
    where: {
      id: sessionId,
    },
  });
  return session;
};
