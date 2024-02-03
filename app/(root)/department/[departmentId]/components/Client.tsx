"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useModal } from "@/hooks/useModalStore";
import { Teacher } from "@prisma/client";
import { Plus } from "lucide-react";
import { columns } from "./Columns";

interface TeacherClientProps {
  data: Teacher[];
}

export const TeacherClient: React.FC<TeacherClientProps> = ({ data }) => {
  const { onOpen } = useModal();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Teachers (${data.length})`}
          description="Manage Teachers"
        />
        <Button onClick={() => onOpen("createTeacher")}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="nom" columns={columns} data={data} />
    </>
  );
};
