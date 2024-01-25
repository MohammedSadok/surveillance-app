"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./CellAction";

export type SessionColum = {
  id: string;
  type: string;
  dateDebut: string;
  dateFin: string;
};

export const columns: ColumnDef<SessionColum>[] = [
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "dateDebut",
    header: "Date de Debut",
  },
  {
    accessorKey: "dateFin",
    header: "Date de Fin",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
