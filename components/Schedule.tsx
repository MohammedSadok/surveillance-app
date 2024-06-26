"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { sessionDays } from "@/lib/types";
import { FileDown } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import PrintSchedule from "./print/PrintSchedule";
import { Button } from "./ui/button";

interface ScheduleProps {
  sessionDays: sessionDays[];
  sessionId: string;
}

const Schedule: React.FC<ScheduleProps> = ({ sessionDays, sessionId }) => {
  const router = useRouter();
  const componentRef = useRef<any>();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <div className="flex flex-col gap-3 relative">
      <div className="flex flex-row-reverse">
        <Button onClick={handlePrint} variant="ghost">
          <FileDown />
        </Button>
      </div>
      <Table className="border rounded-lg">
        <TableHeader>
          <TableRow>
            <TableCell className="border text-center" rowSpan={2}>
              Jours
            </TableCell>
          </TableRow>
          <TableRow>
            {sessionDays[0].timeSlot.map((timeSlotItem) => (
              <TableCell key={timeSlotItem.id} className="border text-center">
                {timeSlotItem.period}
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessionDays.map((item) => (
            <TableRow key={item.id} className="py-4">
              <TableCell className="border text-center">{item.date}</TableCell>
              {item.timeSlot.map((timeSlotItem) => (
                <TableCell
                  key={timeSlotItem.id}
                  className="border text-center cursor-pointer hover:bg-gray-300"
                  onClick={() =>
                    router.push(`/sessions/${sessionId}/${timeSlotItem.id}`, {
                      scroll: false,
                    })
                  }
                >
                  {timeSlotItem.Exam.map((exam) =>
                    exam.moduleName !== "Rs" && exam.moduleName ? (
                      <div key={exam.id}>
                        <p>{exam.moduleName + " / " + exam.options}</p>
                      </div>
                    ) : null
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="hidden">
        <div ref={componentRef}>
          <PrintSchedule sessionDays={sessionDays} />
        </div>
      </div>
    </div>
  );
};

export default Schedule;
