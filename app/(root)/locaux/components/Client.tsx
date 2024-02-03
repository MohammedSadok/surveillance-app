"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useModal } from "@/hooks/useModalStore";
import { Location } from "@prisma/client";
import { Plus } from "lucide-react";
import { columns } from "./Columns";
interface LocationClientProps {
  data: Location[];
}

export const LocationClient: React.FC<LocationClientProps> = ({ data }) => {
  const { onOpen } = useModal();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Locations (${data.length})`}
          description="Manage Locations"
        />
        <Button onClick={() => onOpen("createBuilding")}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="nom" columns={columns} data={data} />
    </>
  );
};
