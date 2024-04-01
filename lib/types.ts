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
  timeSlot: (TimeSlot & { Exam: Exam[] })[];
};

export type timeSlotType = TimeSlot & { day: Day };

export type ExamType = Exam & { moduleResponsible: Teacher | null };

export type TeacherMonitoringData = Teacher & {
  monitoringLines: MonitoringLineType[];
};

type MonitoringLineType = MonitoringLine & {
  monitoring: Monitoring & { exam: Exam | null; location: Location | null };
};
export type MonitoringExam = Exam & {
  moduleResponsible: Teacher | null;
  Monitoring: (Monitoring & {
    location: Location | null;
    monitoringLines: (MonitoringLine & { teacher: Teacher })[];
  })[];
};

export type Student = {
  number: number;
  firstName: string;
  lastName: string;
};

export type ExamStudentType =
  | Exam & {
      moduleResponsible: Teacher | null;
      TimeSlot: timeSlotType;
      Monitoring: (Monitoring & { location: Location | null })[];
      students: Student[];
    };

export type PageTypeStudent = (
  | {
      timeSlot: timeSlotType;
      exam: ExamType;
      location: Location;
      students: Student[][];
    }
  | undefined
)[];
