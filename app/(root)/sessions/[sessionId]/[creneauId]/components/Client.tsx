"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useModal } from "@/hooks/useModalStore";
import { timeSlotType } from "@/lib/types";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { ExamColum, columns } from "./Columns";
interface ExamClientProps {
  data: ExamColum[];
  timeSlot: timeSlotType;
}

export const ExamClient: React.FC<ExamClientProps> = ({ data, timeSlot }) => {
  const { onOpen } = useModal();
  return (
    <>
      <div className="flex items-center justify-between">
        {
          // just for ignore the error message
          timeSlot.day.date && (
            <Heading
              title={`Exams  (${data.length}) `}
              description={`in ${format(timeSlot.day.date, "EEEE d-MM-y")} ${
                timeSlot?.startTime
              } - ${timeSlot?.endTime}`}
            />
          )
        }
        <Button onClick={() => onOpen("createExam")}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="nomDeModule" columns={columns} data={data} />
    </>
  );
};
