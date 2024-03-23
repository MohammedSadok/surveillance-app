"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useModal } from "@/hooks/useModalStore";
import { TeacherType } from "@/lib/types";
import { Plus } from "lucide-react";
import { columns } from "./Columns";

interface TeacherClientProps {
  data: TeacherType[];
}

export const TeacherClient: React.FC<TeacherClientProps> = ({ data }) => {
  const { onOpen } = useModal();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Département  ${data[0].department.name}`}
          description="Gérer les enseignants"
        />
        <Button onClick={() => onOpen("createTeacher")}>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un nouvel enseignant
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="lastName" columns={columns} data={data} />
    </>
  );
};
