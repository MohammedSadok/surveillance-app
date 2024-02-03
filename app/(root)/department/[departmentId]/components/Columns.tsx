"use client";

import { ColumnDef } from "@tanstack/react-table";

import { TeacherType } from "@/lib/types";
import { CellAction } from "./CellAction";
export const columns: ColumnDef<TeacherType>[] = [
  {
    accessorKey: "lastName",
    header: "Nom",
  },
  {
    accessorKey: "firstName",
    header: "Prénom",
  },
  {
    accessorKey: "phoneNumber",
    header: "Numéro de téléphone",
  },
  {
    accessorKey: "email",
    header: "E-mail",
  },
  {
    accessorKey: "Department",
    header: "Département",
    cell: ({ row }) => row.original.department.name,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
