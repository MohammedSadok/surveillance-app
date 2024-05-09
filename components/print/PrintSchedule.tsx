"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import logo from "@/images/logo.png";
import { sessionDays } from "@/lib/types";
import Image from "next/image";
import React from "react";

interface ScheduleProps {
  sessionDays: sessionDays[];
}

const PrintSchedule: React.FC<ScheduleProps> = ({ sessionDays }) => {
  return (
    <div className="flex flex-col gap-3 relative">
      <Image
        src={logo}
        alt={""}
        style={{
          objectFit: "contain",
        }}
        className="w-[200px]"
      />
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
    </div>
  );
};

export default PrintSchedule;
