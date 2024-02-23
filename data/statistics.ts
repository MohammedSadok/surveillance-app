"use server";

import db from "@/lib/db";
import { ExamType } from "@/lib/types";
import { format } from "date-fns";

export const getStatisticsOfLasSession = async () => {
  const lastSession = await db.sessionExam.findFirst({
    orderBy: { id: "desc" },
  });
  const sessionDays = await db.day.findMany({
    where: {
      sessionExamId: lastSession?.id,
    },
    include: {
      timeSlot: { include: { Exam: true } },
    },
  });
  const examsPerDay = sessionDays.map((day) => ({
    day: format(day.date, "LLL dd, y"),
    total: day.timeSlot.reduce(
      (acc, timeSlot) => acc + timeSlot.Exam.length,
      0
    ),
  }));
  const totalMonitoring = await db.monitoringLine.aggregate({
    _count: {
      id: true,
    },
    where: {
      monitoring: {
        exam: { TimeSlot: { day: { sessionExamId: lastSession?.id } } },
      },
    },
  });
  const numberOfExams = await db.exam.count();

  const lastExams: ExamType[] = await db.exam.findMany({
    take: 5,
    include: { moduleResponsible: true },
    orderBy: { id: "desc" },
  });
  const numberOfTeachers = await db.teacher.count();
  const avgMonitoring = (
    (totalMonitoring._count.id / numberOfTeachers) *
    2
  ).toFixed(2);
  const numberOfDepartments = await db.department.count();

  return {
    numberOfTeachers,
    numberOfDepartments,
    lastExams,
    avgMonitoring,
    examsPerDay,
    numberOfExams,
  };
};

export const getAvgTeacher = async () => {
  const lastSession = await db.sessionExam.findFirst({
    orderBy: { id: "desc" },
  });
  const totalMonitoring = await db.monitoringLine.aggregate({
    _count: {
      id: true,
    },
    where: {
      monitoring: {
        exam: { TimeSlot: { day: { sessionExamId: lastSession?.id } } },
      },
    },
  });
  const numberOfTeachers = await db.teacher.count();
  const avgMonitoring = (
    (totalMonitoring._count.id / numberOfTeachers) *
    2
  ).toFixed(2);

  return avgMonitoring;
};

export const getLastFiveExams = async () => {
  return await db.exam.findMany({
    take: 5,
    include: { moduleResponsible: true },
    orderBy: { id: "desc" },
  });
};

export const getExamsPerDay = async () => {
  const lastSession = await db.sessionExam.findFirst({
    orderBy: { id: "desc" },
  });
  return await db.day.findMany({
    where: {
      sessionExamId: lastSession?.id,
    },
    include: {
      timeSlot: { include: { Exam: true } },
    },
  });
};
