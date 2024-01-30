"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useModal } from "@/hooks/useModalStore";
import { Plus } from "lucide-react";
import { SessionColum, columns } from "./Columns";

interface SessionClientProps {
  data: SessionColum[];
}

export const SessionClient: React.FC<SessionClientProps> = ({ data }) => {
  const { onOpen } = useModal();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Sessions (${data.length})`}
          description="Manage Sessions"
        />
        <Button onClick={() => onOpen("createSession")}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="type" columns={columns} data={data} />
      {/* <Heading title="API" description="API Calls for Sessions" /> */}
      {/* <Separator /> */}
      {/* <ApiList entityName="Sessions" entityIdName="SessionId" /> */}
    </>
  );
};
