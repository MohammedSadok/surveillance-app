"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useModal } from "@/hooks/useModalStore";
import { EnseignantType } from "@/lib/types";
import { Plus } from "lucide-react";
import { columns } from "./Columns";

interface EnseignantClientProps {
  data: EnseignantType[];
}

export const EnseignantClient: React.FC<EnseignantClientProps> = ({ data }) => {
  const { onOpen } = useModal();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Enseignants (${data.length})`}
          description="Manage Enseignants"
        />
        <Button onClick={() => onOpen("createTeacher")}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="nom" columns={columns} data={data} />
      {/* <Heading title="API" description="API Calls for Enseignants" /> */}
      {/* <Separator /> */}
      {/* <ApiList entityName="Enseignants" entityIdName="EnseignantId" /> */}
    </>
  );
};
