"use client";
import { Department } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { CellAction } from "./CellAction";

export const columns: ColumnDef<Department>[] = [
  {
    accessorKey: "name",
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
