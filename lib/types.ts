import { Day, Department, Exam, Teacher, TimeSlot } from "@prisma/client";

export type TeacherType = Teacher & { department: Department };

export type sessionDays = Pick<Day, "id" | "sessionExamId"> & {
  date: string;
  timeSlot: (TimeSlot & { Exam: Exam[] })[];
};

export type timeSlotType = TimeSlot & { day: Day };
export type ExamType = Exam & { moduleResponsible: Teacher };
