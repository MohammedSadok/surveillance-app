import { z } from "zod";

export const SessionSchema = z.object({
  type: z.string({
    required_error: "Please select an email to display.",
  }),
  dateDebut: z.date({
    required_error: "Date de début de session is required.",
  }),
  dateFin: z.date({
    required_error: "Date de fin de session is required.",
  }),
});
