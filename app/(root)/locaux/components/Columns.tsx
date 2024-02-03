"use client";
import { Location } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./CellAction";
export const columns: ColumnDef<Location>[] = [
  {
    accessorKey: "name",
    header: "Nom",
  },
  {
    accessorKey: "size",
    header: "Taille",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
