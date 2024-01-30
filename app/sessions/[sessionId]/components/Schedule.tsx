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

import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { day } from "@/constants";
import { PlusCircle } from "lucide-react";
import { Jour } from "../page";

interface ScheduleProps {
  days: Jour[];
}

const Schedule: React.FC<ScheduleProps> = ({ days }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = days.slice(indexOfFirstItem, indexOfLastItem);

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
            {day.map((dayItem, index) => (
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
            {day.map((dayItem, index) => (
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
              {item.Creneau.map((crenauItem) => (
                <TableCell key={crenauItem.id} className="border text-center">
                  <Button className="" variant="ghost">
                    {/* {crenauItem.id} */}
                    <PlusCircle />
                  </Button>
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