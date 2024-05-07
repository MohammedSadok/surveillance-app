"use server";
import db from "@/lib/db";
import { TimePeriod } from "@prisma/client";
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
            const { freeTeacherIds, locationTeachersMap } =
              await getTeachersForExam(timeSlot.id);
            if (monitoring.location?.id) {
              let neededTeachers: number[] = [];
              const teachersForLocation = locationTeachersMap.get(
                monitoring.location.id
              );
              if (teachersForLocation !== undefined) {
                neededTeachers = teachersForLocation;
              } else {
                const neededTeacherNumber =
                  monitoring.location?.type === "AMPHITHEATER"
                    ? monitoring.location?.name === "NA"
                      ? 4
                      : 3
                    : 2;
                neededTeachers = freeTeacherIds.slice(0, neededTeacherNumber);
              }
              for (const neededTeacher of neededTeachers) {
                await db.monitoringLine.create({
                  data: {
                    teacher: {
                      connect: { id: neededTeacher },
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
    }
    const RsTeachers = await getRsTeachersForDay(day.id);
    const RsTeachersMorning = RsTeachers.slice(0, 10);
    const RsTeachersAfternoon = RsTeachers.slice(10, 20);

    // Counter for tracking teacher index in the Rs arrays
    let morningIndex = 0;
    let afternoonIndex = 0;

    for (let i = 0; i < day.timeSlot.length; i++) {
      const timeSlot = day.timeSlot[i];
      const RsTeachers = i < 2 ? RsTeachersMorning : RsTeachersAfternoon;

      await db.exam.create({
        data: {
          moduleName: "Rs",
          options: "",
          enrolledStudentsCount: 0,
          timeSlotId: timeSlot.id,
          responsibleId: null,
          Monitoring: {
            create: [
              {
                locationId: null,
                monitoringLines: {
                  create: RsTeachers,
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
              { exam: { moduleName: { equals: "Rs" } } },
            ],
          },
        },
      ],
    },
  });
};

export const getMonitoringDay = async (
  dayId: number,
  timePeriod: TimePeriod
) => {
  const exams = await db.exam.findMany({
    where: {
      TimeSlot: { dayId, timePeriod },
      moduleName: { notIn: ["", "Rs"] },
    },
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

  // Create an object to store the data for each location
  const locationData: { [key: string]: { exams: any[] } } = {};

  // Iterate over each exam to organize the data by location
  exams.forEach((exam) => {
    // Iterate over each monitoring entry within the exam
    exam.Monitoring?.forEach((monitoringEntry) => {
      if (monitoringEntry.location?.name) {
        const locationName = monitoringEntry.location.name;

        // Create a key for the location if it doesn't exist
        if (!locationData[locationName]) {
          locationData[locationName] = { exams: [] };
        }

        // Push exam details and teachers to the location data
        locationData[locationName].exams.push({
          examDetails: {
            id: exam.id,
            moduleName: exam.moduleName,
            options: exam.options,
            enrolledStudentsCount: exam.enrolledStudentsCount,
            timeSlotId: exam.timeSlotId,
            responsibleId: exam.responsibleId,
            moduleResponsible: exam.moduleResponsible,
          },
          teachers:
            monitoringEntry.monitoringLines
              .map((line) => line.teacher?.lastName)
              .filter(Boolean) || [],
        });
      }
    });
  });
  return locationData;
};

export const deleteSession = async (sessionId: number) => {
  const session = await db.sessionExam.delete({
    where: {
      id: sessionId,
    },
  });
  return session;
};

export const getRsTeachersForDay = async (dayId: number) => {
  const avgTeachers = await db.monitoringLine.groupBy({
    by: ["teacherId"],
    _count: {
      id: true,
    },
    orderBy: { _count: { id: "asc" } },
    where: {
      teacher: {
        AND: [
          {
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
          {
            monitoringLines: {
              some: { monitoring: { exam: { moduleName: { equals: "Rs" } } } },
            },
          },
        ],
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
