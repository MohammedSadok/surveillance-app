"use client";
import { User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./CellAction";
export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Nom complet",
    cell: ({ row }) => row.original.name,
  },

  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.original.email,
  },
  {
    accessorKey: "isAdmin",
    header: "Admin",
    cell: ({ row }) => row.original.isAdmin,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
