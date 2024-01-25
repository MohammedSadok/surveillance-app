"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DepartementType } from "@/lib/types";
import { CellAction } from "./CellAction";

export const columns: ColumnDef<DepartementType>[] = [
  {
    accessorKey: "nom",
    header: "Nom",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
