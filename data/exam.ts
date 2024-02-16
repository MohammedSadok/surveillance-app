"use server";
import db from "@/lib/db";
export const getStudentsForExam = async (id: number) => {
  const exam = await db.exam.findUnique({
    where: { id: id },
    include: {
      moduleResponsible: true,
      TimeSlot: true,
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
  return { examRooms, remainingStudent: enrolledStudentsCount };
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

  const teachersInSamePeriod = await db.teacher.findMany({
    select: { id: true },
    where: {
      AND: [
        {
          id: {
            in: avgTeachersIds,
          },
        },
        {
          monitoringLines: {
            some: {
              monitoring: {
                exam: {
                  TimeSlot: { dayId: day?.dayId, timePeriod: day?.timePeriod },
                },
              },
            },
          },
        },
      ],
    },
  });
  const teachersInSamePeriodIds: number[] = teachersInSamePeriod.map(
    ({ id }) => id
  );
  freeTeacherIds.sort((a, b) => {
    const indexA = teachersInSamePeriodIds.indexOf(a);
    const indexB = teachersInSamePeriodIds.indexOf(b);
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    if (indexA !== -1) {
      return -1;
    }
    if (indexB !== -1) {
      return 1;
    }
    return 0;
  });
  return freeTeacherIds;
};
