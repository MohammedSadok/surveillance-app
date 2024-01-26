import { Departement, Enseignant } from "@prisma/client";

export type EnseignantType = Enseignant & { departement: Departement };
export type DepartementType = {
  id: string;
  nom: string;
};

export type FiliereType = {
  id: string;
  nom: string;
  departementId: string;
  departement: DepartementType;
};
