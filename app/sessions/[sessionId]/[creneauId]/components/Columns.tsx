"use client";
import { Enseignant, Examen } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./CellAction";

export type ExamColum = Examen & { responsable_module: Enseignant };

export const columns: ColumnDef<ExamColum>[] = [
  {
    accessorKey: "nomDeModule",
    header: "module",
  },

  {
    accessorKey: "filieres",
    header: "Filiere",
  },
  {
    accessorKey: "nombreDetudiantInscrit",
    header: "Nombre Inscrit",
  },
  {
    accessorKey: "responsable_module",
    header: "Responsable de module",
    cell: ({ row }) => (
      <p>
        Pr.
        {row.original.responsable_module.nom +
          " " +
          row.original.responsable_module.prenom}
      </p>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
