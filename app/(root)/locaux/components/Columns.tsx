"use client";
import { Location } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./CellAction";
export const columns: ColumnDef<Location>[] = [
  {
    accessorKey: "name",
    header: "Nom",

    cell: ({ row }) =>
      row.original.type == "AMPHITHEATER"
        ? row.original.name
        : "Salle " + row.original.name,
  },
  {
    accessorKey: "size",
    header: "Taille",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) =>
      row.original.type == "AMPHITHEATER" ? "amphi" : "salle",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
