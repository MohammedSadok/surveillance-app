"use server";
import db from "@/lib/db";
import { Location } from "@prisma/client";

export const getLocationsForExam = async (
  timeSlotId: number,
  enrolledStudentsCount: number
) => {
  const occupiedLocations = await db.monitoring.findMany({
    where: {
      exam: { timeSlotId: timeSlotId },
    },
    select: { id: true },
  });
  const occupiedLocationsIds = occupiedLocations.map((local) => local.id);
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

export const getTeachersForExam = async (
  timeSlotId: number,
  responsibleId: number,
  locations: Location[]
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

  occupiedTeacherIds.push(responsibleId);
  const freeTeachers = await db.teacher.findMany({
    where: {
      id: {
        notIn: occupiedTeacherIds,
      },
    },
  });

  return freeTeachers;
};
