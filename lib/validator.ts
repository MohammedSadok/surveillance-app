import { z } from "zod";

export const SessionSchema = z.object({
  type: z.string({
    required_error: "Veuillez sélectionner un type pour la session d'examens.",
  }),
  startDate: z.date({
    required_error: "La date de début de session est requise.",
  }),
  endDate: z.date({
    required_error: "La date de fin de session est requise.",
  }),
});

export const DepartmentSchema = z.object({
  name: z.string().min(3, {
    message: "Le nom doit contenir au moins 3 caractères.",
  }),
});

export const TeacherSchema = z.object({
  lastName: z.string().min(3, {
    message: "Le nom doit contenir au moins 3 caractères.",
  }),
  firstName: z.string().min(3, {
    message: "Le prénom doit contenir au moins 3 caractères.",
  }),
  phoneNumber: z.string().refine((value) => value.length === 10, {
    message: "Le numéro de téléphone doit contenir exactement 10 caractères.",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse e-mail valide.",
  }),
  departmentId: z.number().int().min(1, {
    message: "Veuillez sélectionner un département.",
  }),
});

export const LocationSchema = z.object({
  name: z.string().min(1, {
    message: "Le nom doit contenir au moins 1 caractère.",
  }),
  size: z.number().int().min(1, {
    message: "La taille doit être un nombre entier positif.",
  }),
  type: z.enum(["CLASSROOM", "AMPHITHEATER"], {
    required_error: "Vous devez selectionner le type.",
  }),
});

export const ExamSchema = z.object({
  moduleName: z.string().min(3, {
    message: "Le nom doit contenir au moins 3 caractères.",
  }),
  options: z.string().min(3, {
    message: "Le champ des options doit contenir au moins 3 caractères.",
  }),
  enrolledStudentsCount: z.number().int().min(1, {
    message: "Le nombre d'étudiants doit être positif.",
  }),
  responsibleId: z.number().int().min(1, {
    message: "Le responsable du module est requis.",
  }),
  timeSlotId: z.number().int().min(1, {
    message: "L'identifiant de l'intervalle de temps est requis.",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "L'adresse e-mail est requise",
  }),
  password: z.string().min(1, {
    message: "Le mot de passe est requis",
  }),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "L'adresse e-mail est requise",
  }),
  password: z.string().min(6, {
    message: "Au moins 6 caractères sont requis",
  }),
  name: z.string().min(1, {
    message: "Le nom est requis",
  }),
});
