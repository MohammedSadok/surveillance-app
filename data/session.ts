import db from "@/lib/db";

export const getMonitoring = async (sessionID: number) => {
  // const exams = await db.day.findMany({
  //   where: { sessionExamId: sessionID },
  //   include: {
  //     timeSlot: {
  //       include: {
  //         Exam: {
  //           include: {
  //             moduleResponsible: true,
  //             Monitoring: {
  //               include: {
  //                 location: true,
  //                 monitoringLines: {
  //                   include: { teacher: true },
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //   },
  // });

  const teacherMonitoring = db.teacher.findMany({
    include: {
      monitoringLines: {
        include: { monitoring: { include: { exam: true, location: true } } },
      },
    },
    // where: { departmentId: 1 },
  });
  return teacherMonitoring;
};
