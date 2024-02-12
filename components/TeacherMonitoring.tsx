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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMonitoring } from "@/data/session";
import { TeacherMonitoringData, sessionDays } from "@/lib/types";
import { Department } from "@prisma/client";
import axios from "axios";
import { FileDown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
interface TeacherMonitoringProps {
  sessionDays: sessionDays[];
  sessionId: string;
}

const TeacherMonitoring: React.FC<TeacherMonitoringProps> = ({
  sessionDays,
  sessionId,
}) => {
  const componentRef = useRef<any>();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [department, setDepartment] = useState<number>(0);
  const [monitoring, setMonitoring] = useState<TeacherMonitoringData[]>([]);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/departments"
        );
        setDepartments(response.data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des départements :",
          error
        );
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const monitoring: TeacherMonitoringData[] = await getMonitoring(
        department,
        parseInt(sessionId)
      );
      setMonitoring(monitoring);
    };

    fetchData();
  }, [department, sessionId]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const displayedTeachers = monitoring.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <Select onValueChange={(value) => setDepartment(Number(value))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sélectionnez le département" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((item) => (
              <SelectItem value={item.id.toString()} key={item.id}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handlePrint} variant="ghost">
          <FileDown />
        </Button>
      </div>
      <Table className="border rounded-lg" ref={componentRef}>
        <TableHeader>
          <TableRow>
            <TableCell className="border text-center" rowSpan={2}>
              Jours
            </TableCell>
            {sessionDays.map((item) => (
              <TableCell
                className="border text-center"
                key={item.id}
                colSpan={4}
              >
                {item.date}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            {sessionDays.map((item) =>
              item.timeSlot.map((timeSlotItem) => (
                <TableCell
                  key={timeSlotItem.id}
                  className="border text-center text-xs"
                >
                  {timeSlotItem.period}
                </TableCell>
              ))
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedTeachers.map((teacher) => (
            <TableRow key={teacher.id} className="py-4">
              <TableCell className="border text-center">
                {teacher.firstName + " " + teacher.lastName}
              </TableCell>
              {sessionDays.map((item) =>
                item.timeSlot.map((timeSlotItem) => {
                  const monitoringLine = teacher.monitoringLines.find(
                    (monitoringLine) =>
                      monitoringLine.monitoring.exam?.timeSlotId ===
                      timeSlotItem.id
                  );
                  return (
                    <TableCell
                      key={timeSlotItem.id}
                      className="border text-center text-s"
                    >
                      {monitoringLine ? (
                        <span>
                          {monitoringLine.monitoring.location === null
                            ? "TT"
                            : monitoringLine.monitoring.location?.name}
                        </span>
                      ) : null}
                    </TableCell>
                  );
                })
              )}
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
            { length: Math.ceil(monitoring.length / itemsPerPage) },
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
                currentPage < Math.ceil(monitoring.length / itemsPerPage) &&
                handlePageChange(currentPage + 1)
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default TeacherMonitoring;
