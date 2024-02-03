"use client";
import { Button } from "@/components/ui/button";
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
import { days } from "@/constants";
import { sessionDays } from "@/lib/types";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface ScheduleProps {
  sessionDays: sessionDays[];
  sessionId: string;
}

const Schedule: React.FC<ScheduleProps> = ({ sessionDays, sessionId }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sessionDays.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <Table className="border rounded-lg">
        <TableHeader>
          <TableRow>
            <TableCell className="border text-center" rowSpan={2}>
              Jours
            </TableCell>
            {days.map((dayItem, index) => (
              <React.Fragment key={index}>
                <TableCell
                  key={index * 2}
                  className="border text-center"
                  colSpan={2}
                >
                  {Object.keys(dayItem)[0]}
                </TableCell>
              </React.Fragment>
            ))}
          </TableRow>
          <TableRow>
            {days.map((dayItem, index) => (
              <React.Fragment key={index}>
                {Object.values(dayItem)[0].map((hour, hourIndex) => (
                  <TableCell
                    key={index * 2 + hourIndex}
                    className="border text-center"
                  >
                    {hour}
                  </TableCell>
                ))}
              </React.Fragment>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((item) => (
            <TableRow key={item.id} className="py-4">
              <TableCell className="border text-center">{item.date}</TableCell>
              {item.timeSlot.map((timeSlotItem) => (
                <TableCell key={timeSlotItem.id} className="border text-center">
                  <Link href={`/sessions/${sessionId}/${timeSlotItem.id} `}>
                    <Button className="" variant="ghost">
                      <PlusCircle />
                    </Button>
                  </Link>
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
            { length: Math.ceil(days.length / itemsPerPage) },
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
                currentPage < Math.ceil(days.length / itemsPerPage) &&
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
