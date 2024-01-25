"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useModal } from "@/hooks/useModalStore";
import { DepartementType, FiliereType } from "@/lib/types";
import { Plus } from "lucide-react";
import { columns } from "./Columns";

interface FiliereClientProps {
  data: FiliereType[];
  departements: DepartementType[];
}

export const FiliereClient: React.FC<FiliereClientProps> = ({
  data,
  departements,
}) => {
  const { onOpen } = useModal();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Filieres (${data.length})`}
          description="Manage Filieres"
        />
        <Button onClick={() => onOpen("createFiliere")}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="type" columns={columns} data={data} />
      {/* <Heading title="API" description="API Calls for Filieres" /> */}
      {/* <Separator /> */}
      {/* <ApiList entityName="Filieres" entityIdName="FiliereId" /> */}
    </>
  );
};
