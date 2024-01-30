"use client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
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
    cell: ({ row }) => (
      <Link href={`/sessions/${row.original.id}`} className="underline">
        {row.original.type}
      </Link>
    ),
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
