export type ScheduleItem = {
  [key: string]: string[];
};
export const day: ScheduleItem[] = [
  { Matin: ["8:00 AM - 10:00 AM", "10:00 AM - 12:00 AM"] },
  { "Apres midi": ["2:00 PM - 4:00 PM", "4:00 PM - 6:00 PM"] },
];
