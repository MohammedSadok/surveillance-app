"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useModal } from "@/hooks/useModalStore";
import { Local } from "@prisma/client";
import { Plus } from "lucide-react";
import { columns } from "./Columns";
interface LocalClientProps {
  data: Local[];
}

export const LocalClient: React.FC<LocalClientProps> = ({ data }) => {
  const { onOpen } = useModal();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Locals (${data.length})`}
          description="Manage Locals"
        />
        <Button onClick={() => onOpen("createBuilding")}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="nom" columns={columns} data={data} />
      {/* <Heading title="API" description="API Calls for =Locals" /> */}
      {/* <Separator /> */}
      {/* <ApiList entityName="=Locals" entityIdName="=LocalId" /> */}
    </>
  );
};
