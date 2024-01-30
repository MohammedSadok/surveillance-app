"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useModal } from "@/hooks/useModalStore";
import { Creneau, Journee } from "@prisma/client";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { ExamColum, columns } from "./Columns";

interface ExamClientProps {
  data: ExamColum[];
  creneau: (Creneau & { journee: Journee }) | null;
}

export const ExamClient: React.FC<ExamClientProps> = ({ data, creneau }) => {
  const { onOpen } = useModal();
  return (
    <>
      <div className="flex items-center justify-between">
        {
          // just for ignore the error message
          creneau?.journee.date && (
            <Heading
              title={`Exams  (${data.length}) `}
              description={`in ${format(
                creneau?.journee.date,
                "EEEE d-MM-y"
              )} ${creneau?.heureDebut} - ${creneau?.heureFin}`}
            />
          )
        }
        <Button onClick={() => onOpen("createSession")}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="nomDeModule" columns={columns} data={data} />
      {/* <Heading title="API" description="API Calls for Sessions" /> */}
      {/* <Separator /> */}
      {/* <ApiList entityName="Sessions" entityIdName="SessionId" /> */}
    </>
  );
};
