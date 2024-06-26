"use server";
import db from "@/lib/db";
export const getStudentsForExam = async (id: number) => {
  const exam = await db.exam.findUnique({
    where: { id: id },
    include: {
      moduleResponsible: true,
      TimeSlot: { include: { day: true } },
      Monitoring: { include: { location: true } },
      students: { select: { number: true, firstName: true, lastName: true } },
    },
  });
  return exam;
};
export const getLocationsForExam = async (
  timeSlotId: number,
  enrolledStudentsCount: number
) => {
  const occupiedLocations = await db.monitoring.findMany({
    where: {
      exam: { timeSlotId: timeSlotId },
    },
    select: { locationId: true },
  });

  const occupiedLocationsIds: number[] = occupiedLocations
    .filter((local) => local.locationId !== null)
    .map((local) => local.locationId as number);

  const freeLocations = await db.location.findMany({
    where: {
      id: {
        notIn: occupiedLocationsIds,
      },
    },
    orderBy: { size: "desc" },
  });
  const examRooms = [];
  for (let i = 0; i < freeLocations.length; i++) {
    const currentLocation = freeLocations[i];
    const nextLocation = freeLocations[i + 1];

    if (enrolledStudentsCount >= currentLocation.size) {
      examRooms.push({
        ...currentLocation,
        studentsCount: currentLocation.size,
      });
      enrolledStudentsCount -= currentLocation.size;
    } else if (nextLocation && enrolledStudentsCount <= nextLocation.size)
      continue;
    else if (enrolledStudentsCount) {
      examRooms.push({
        ...currentLocation,
        studentsCount: enrolledStudentsCount,
      });
      enrolledStudentsCount = 0;
    }
  }

  const rooms = examRooms.map((room) => room.id);
  return { rooms, remainingStudent: enrolledStudentsCount };
};
export const getLocationsForExamManual = async (timeSlotId: number) => {
  const occupiedLocations = await db.monitoring.findMany({
    where: {
      exam: { timeSlotId: timeSlotId },
    },
    select: { locationId: true },
  });

  const occupiedLocationsIds: number[] = occupiedLocations
    .filter((local) => local.locationId !== null)
    .map((local) => local.locationId as number);

  const freeLocations = await db.location.findMany({
    where: {
      id: {
        notIn: occupiedLocationsIds,
      },
    },
    orderBy: { size: "desc" },
  });

  return { freeLocations };
};

export const getTeachersForExam = async (timeSlotId: number) => {
  const avgTeachers = await db.monitoringLine.groupBy({
    by: ["teacherId"],
    _count: {
      id: true,
    },
    orderBy: { _count: { id: "asc" } },
    where: {
      teacher: {
        isDispense: false,
        monitoringLines: {
          none: {
            monitoring: {
              exam: {
                timeSlotId: timeSlotId,
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
    where: {
      AND: [
        {
          isDispense: false,
          id: {
            notIn: avgTeachersIds,
          },
        },
        {
          monitoringLines: {
            none: {
              monitoring: {
                exam: {
                  timeSlotId: timeSlotId,
                },
              },
            },
          },
        },
      ],
    },
  });

  // to get teacher dose not have any monitoring
  const freeTeacherIds = freeTeachers.map(({ id }) => id);

  freeTeacherIds.push(...avgTeachersIds);

  const day = await db.timeSlot.findUnique({
    where: { id: timeSlotId },
  });

  const monitoringInTheSameDay = await db.monitoring.findMany({
    include: {
      location: true,
      monitoringLines: { include: { teacher: true } },
    },
    where: {
      NOT: {
        location: null,
      },
      monitoringLines: {
        some: {
          teacher: {
            isDispense: false,
          },
          monitoring: {
            exam: {
              TimeSlot: { dayId: day?.dayId, timePeriod: day?.timePeriod },
            },
          },
        },
      },
    },
  });

  let locationTeachersMap = new Map<number, number[]>();
  // Fill the Map with data
  monitoringInTheSameDay.forEach((item) => {
    if (item.location) {
      const locationId = item.location.id;
      const teacherIds: number[] = item.monitoringLines.map(
        ({ teacherId }) => teacherId
      );
      locationTeachersMap.set(locationId, teacherIds);
    }
  });
  return { freeTeacherIds, locationTeachersMap };
};
