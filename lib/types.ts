export type DepartementType = {
  id: string;
  nom: string;
};

export type FiliereType = {
  id: string;
  nom: string;
  departementId: string;
};
