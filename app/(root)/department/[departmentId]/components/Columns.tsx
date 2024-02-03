"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Teacher } from "@prisma/client";
import { CellAction } from "./CellAction";
export const columns: ColumnDef<Teacher>[] = [
  {
    accessorKey: "lastName",
    header: "Nom",
  },
  {
    accessorKey: "firstName",
    header: "Prenom",
  },
  {
    accessorKey: "phoneNumber",
    header: "Numero tel",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  // {
  //   accessorKey: "Department",
  //   header: "department",
  //   cell: ({ row }) => row.original.department,
  // },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
