export type ScheduleItem = {
  [key: string]: string[];
};
export const days: ScheduleItem[] = [
  { Matin: ["8:00 - 10:00", "10:00 - 12:00"] },
  { "Apres midi": ["2:00 - 4:00", "4:00 - 6:00"] },
];
