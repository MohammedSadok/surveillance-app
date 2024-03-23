"use client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { sessionDays } from "@/lib/types";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface ScheduleProps {
  sessionDays: sessionDays[];
  sessionId: string;
}

const Schedule: React.FC<ScheduleProps> = ({ sessionDays, sessionId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sessionDays.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3 relative">
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
          {currentItems.map((item) => (
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
                  {timeSlotItem.Exam.map(
                    (exam) =>
                      exam.moduleName !== "Reservist" && (
                        <p key={exam.id}>{exam.moduleName}</p>
                      )
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination className="flex flex-col">
        <PaginationContent className="self-end">
          <PaginationItem className="hover:cursor-pointer">
            <PaginationPrevious
              onClick={() =>
                currentPage > 1 && handlePageChange(currentPage - 1)
              }
            />
          </PaginationItem>
          {Array.from(
            { length: Math.ceil(sessionDays.length / itemsPerPage) },
            (_, index) => (
              <PaginationItem key={index + 1} className="hover:cursor-pointer">
                <PaginationLink
                  onClick={() => handlePageChange(index + 1)}
                  isActive={index + 1 === currentPage}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem className="hover:cursor-pointer">
            <PaginationNext
              onClick={() =>
                currentPage < Math.ceil(sessionDays.length / itemsPerPage) &&
                handlePageChange(currentPage + 1)
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default Schedule;
