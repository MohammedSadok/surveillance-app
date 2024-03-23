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
  const daysWithExams = await db.day.findMany({
    where: {
      AND: [
        {
          sessionExam: {
            id: sessionId,
          },
        },
        {
          timeSlot: { some: { Exam: { some: {} } } },
        },
      ],
    },
    include: {
      timeSlot: {
        include: {
          Exam: { include: { Monitoring: { include: { location: true } } } },
        },
      },
    },
  });
  for (const day of daysWithExams) {
    for (const timeSlot of day.timeSlot) {
      for (const exam of timeSlot.Exam) {
        for (const monitoring of exam.Monitoring) {
          if (monitoring.locationId) {
            const freeTeacherIds = await getTeachersForExam(timeSlot.id);
            const neededTeacherNumber =
              monitoring.location?.type === "AMPHITHEATER"
                ? monitoring.location?.name === "NOVA"
                  ? 4
                  : 3
                : 2;
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
    const ReservistTeachers = await getReservistTeachersForDay(day.id);
    const reservistTeachersMorning = ReservistTeachers.slice(0, 10);
    const reservistTeachersAfternoon = ReservistTeachers.slice(10, 20);

    // Counter for tracking teacher index in the reservist arrays
    let morningIndex = 0;
    let afternoonIndex = 0;

    for (let i = 0; i < day.timeSlot.length; i++) {
      const timeSlot = day.timeSlot[i];
      const reservistTeachers =
        i < 2 ? reservistTeachersMorning : reservistTeachersAfternoon;

      await db.exam.create({
        data: {
          moduleName: "Reservist",
          options: "",
          enrolledStudentsCount: 0,
          timeSlotId: timeSlot.id,
          responsibleId: null,
          Monitoring: {
            create: [
              {
                locationId: null,
                monitoringLines: {
                  create: reservistTeachers,
                },
              },
            ],
          },
        },
      });

      // Increment the morning or afternoon index depending on the current time slot
      if (i % 2 === 0) {
        morningIndex++;
      } else {
        afternoonIndex++;
      }
    }
  }
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
        {
          monitoring: {
            OR: [
              {
                location: { isNot: null },
              },
              { exam: { moduleName: { equals: "Reservist" } } },
            ],
          },
        },
      ],
    },
  });
};

export const getMonitoringDay = async (dayId: number) => {
  return await db.exam.findMany({
    where: { TimeSlot: { dayId: dayId }, moduleName: { not: "" } },
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

export const getReservistTeachersForDay = async (dayId: number) => {
  const avgTeachers = await db.monitoringLine.groupBy({
    by: ["teacherId"],
    _count: {
      id: true,
    },
    orderBy: { _count: { id: "asc" } },
    where: {
      teacher: {
        NOT: {
          monitoringLines: {
            some: {
              monitoring: {
                exam: {
                  TimeSlot: {
                    dayId,
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const avgTeachersIds: number[] = avgTeachers.map(
    ({ teacherId }) => teacherId
  );
  const freeTeachers = await db.teacher.findMany({
    select: { id: true },
    where: {
      AND: [
        {
          id: {
            notIn: avgTeachersIds,
          },
        },
        {
          monitoringLines: {
            none: {
              monitoring: {
                exam: {
                  TimeSlot: {
                    dayId,
                  },
                },
              },
            },
          },
        },
      ],
    },
  });
  const freeTeacherIds = freeTeachers.map(({ id }) => id);

  freeTeacherIds.push(...avgTeachersIds);

  return freeTeacherIds.splice(0, 20).map((teacherId) => {
    return {
      teacherId: teacherId,
    };
  });
};
