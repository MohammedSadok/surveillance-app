"use client";
import { Local } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./CellAction";
export const columns: ColumnDef<Local>[] = [
  {
    accessorKey: "nom",
    header: "Nom",
  },
  {
    accessorKey: "emplacement",
    header: "Emplacement",
  },
  {
    accessorKey: "taille",
    header: "Taille",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
