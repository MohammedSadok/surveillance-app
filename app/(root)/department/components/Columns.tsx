"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Department } from "@prisma/client";
import Link from "next/link";
import { CellAction } from "./CellAction";

export const columns: ColumnDef<Department>[] = [
  {
    accessorKey: "nom",
    header: "Nom",
    cell: ({ row }) => (
      <Link href={`/department/${row.original.id}`} className="underline">
        {row.original.name}
      </Link>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
