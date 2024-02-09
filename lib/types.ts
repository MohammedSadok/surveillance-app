import {
  Day,
  Department,
  Exam,
  Location,
  Monitoring,
  MonitoringLine,
  Teacher,
  TimeSlot,
} from "@prisma/client";

export type TeacherType = Teacher & { department: Department };

export type sessionDays = Pick<Day, "id" | "sessionExamId"> & {
  date: string;
  timeSlot: TimeSlot[];
};

export type timeSlotType = TimeSlot & { day: Day };
export type ExamType = Exam & { moduleResponsible: Teacher };

export type TeacherMonitoringData = Teacher & {
  monitoringLines: MonitoringLineType[];
};

type MonitoringLineType = MonitoringLine & {
  monitoring: Monitoring & { exam: Exam | null; location: Location | null };
};
