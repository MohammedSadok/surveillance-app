"use client";

import { ColumnDef } from "@tanstack/react-table";

import { FiliereType } from "@/lib/types";
import { CellAction } from "./CellAction";

export const columns: ColumnDef<FiliereType>[] = [
  {
    accessorKey: "nom",
    header: "Nom",
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
