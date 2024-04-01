"use client";
import { User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./CellAction";
import { Check, X } from "lucide-react";
export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Nom",

    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "idAdmin",
    header: "Is Admin",
    cell: ({ row }) =>
      row.original.isAdmin === false ? (
        <X className="w-5 h-5" />
      ) : (
        <Check className="w-5 h-5 " />
      ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
