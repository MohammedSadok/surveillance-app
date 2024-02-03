"use client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { CellAction } from "./CellAction";

export type SessionColum = {
  id: number;
  type: string;
  startDate: string;
  endDate: string;
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
    accessorKey: "startDate",
    header: "Date de Debut",
  },
  {
    accessorKey: "endDate",
    header: "Date de Fin",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
