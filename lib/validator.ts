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

export const DepartementSchema = z.object({
  nom: z.string(),
});

export const FiliereSchema = z.object({
  nom: z.string(),
  departementId: z.string(),
});

export const EnseignantSchema = z.object({
  nom: z.string().min(3, {
    message: "Le nom doit contenir au moins 3 caractères.",
  }),
  prenom: z.string().min(3, {
    message: "Le prénom doit contenir au moins 3 caractères.",
  }),
  numero_tel: z.string().refine((value) => value.length === 10, {
    message: "Le numéro de téléphone doit contenir exactement 10 caractères.",
  }),
  e_mail: z.string().email({
    message: "Veuillez entrer une adresse e-mail valide.",
  }),
  departementId: z.number().int().min(1, {
    message: "Veuillez sélectionner un département.",
  }),
});

export const LocalSchema = z.object({
  nom: z.string().min(3, {
    message: "Le nom doit contenir au moins 3 caractères.",
  }),
  emplacement: z.string().min(3, {
    message: "L'emplacement doit contenir au moins 3 caractères.",
  }),
  taille: z.number().int().min(1, {
    message: "La taille doit être un nombre entier positif .",
  }),
});
