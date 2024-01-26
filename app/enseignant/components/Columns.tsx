"use client";

import { ColumnDef } from "@tanstack/react-table";

import { EnseignantType } from "@/lib/types";
import { CellAction } from "./CellAction";
export const columns: ColumnDef<EnseignantType>[] = [
  {
    accessorKey: "nom",
    header: "Nom",
  },
  {
    accessorKey: "prenom",
    header: "Prenom",
  },
  {
    accessorKey: "numero_tel",
    header: "Numero tel",
  },
  {
    accessorKey: "e_mail",
    header: "Email",
  },
  {
    accessorKey: "Department",
    header: "department",
    cell: ({ row }) => row.original.departement.nom,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
