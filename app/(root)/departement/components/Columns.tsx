"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DepartementType } from "@/lib/types";
import { CellAction } from "./CellAction";
import Link from "next/link";

export const columns: ColumnDef<DepartementType>[] = [
  {
    accessorKey: "nom",
    header: "Nom",
    cell: ({ row }) => (
      <Link href={`/departement/${row.original.id}`} className="underline">
        {row.original.nom}
      </Link>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
