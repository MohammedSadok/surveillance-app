import db from "@/lib/db";

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
  let remainingStudents = enrolledStudentsCount;
  for (const location of freeLocations) {
    if (remainingStudents <= 0) {
      break;
    }
    const studentsToFit = Math.min(remainingStudents, location.size);
    examRooms.push({
      locationId: location.id,
      studentsCount: studentsToFit,
    });
    remainingStudents -= studentsToFit;
  }
  return examRooms;
};

export const getTeachersForExam = async (
  timeSlotId: number,
  roomsNumber: number,
  responsibleId: number
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
  return freeTeachers.slice(0, roomsNumber * 2);
};
