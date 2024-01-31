"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useModal } from "@/hooks/useModalStore";
import { DepartementType } from "@/lib/types";
import { Plus } from "lucide-react";
import { columns } from "./Columns";

interface DepartementClientProps {
  data: DepartementType[];
}

export const DepartementClient: React.FC<DepartementClientProps> = ({
  data,
}) => {
  const { onOpen } = useModal();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Departements (${data.length})`}
          description="Manage Departements"
        />
        <Button onClick={() => onOpen("createDepartment")}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="nom" columns={columns} data={data} />
      {/* <Heading title="API" description="API Calls for Departements" /> */}
      {/* <Separator /> */}
      {/* <ApiList entityName="Departements" entityIdName="DepartementId" /> */}
    </>
  );
};