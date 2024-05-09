"use client";

import { ColumnDef } from "@tanstack/react-table";

import { TeacherType } from "@/lib/types";
import { CellAction } from "./CellAction";
import { Check, X } from "lucide-react";
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
    accessorKey: "isDispense",
    header: "Est Dispencer",
    cell: ({ row }) =>
      row.original.isDispense === false ? (
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
