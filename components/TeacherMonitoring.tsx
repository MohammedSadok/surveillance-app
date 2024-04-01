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
import { getMonitoring, getMonitoringDay } from "@/data/session";
import {
  MonitoringExam,
  TeacherMonitoringData,
  sessionDays,
} from "@/lib/types";
import { Department } from "@prisma/client";
import axios from "axios";
import {
  ArrowLeftCircle,
  ArrowRightCircle,
  FileDown,
  Loader2,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import PrintDayMonitoring from "./print/PrintMonitoringDay";
import PrintTeacherMonitoring from "./print/PrintTeacherMonitoring";
interface TeacherMonitoringProps {
  sessionDays: sessionDays[];
  sessionId: string;
}

const TeacherMonitoring: React.FC<TeacherMonitoringProps> = ({
  sessionDays,
  sessionId,
}) => {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentDay, setCurrentDay] = useState(0); // Manage the current day index
  const [departments, setDepartments] = useState<Department[]>([]);
  const [department, setDepartment] = useState<number>(0);
  const [monitoring, setMonitoring] = useState<TeacherMonitoringData[]>([]);
  const [monitoringDay, setMonitoringDay] = useState<MonitoringExam[]>([]);
  const itemsPerPage = 10;
  const componentRef = useRef<any>();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const dayRef = useRef<any>();
  const handlePrintDay = useReactToPrint({
    content: () => dayRef.current,
  });

  const loadExams = async () => {
    try {
      setLoading(true);
      const exams = await getMonitoringDay(sessionDays[currentDay].id);

      if (exams) {
        setMonitoringDay(exams);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setLoading(false);
    }
  };

  // Use useEffect to call handlePrintDay when monitoringDay changes
  useEffect(() => {
    if (monitoringDay.length > 0) {
      handlePrintDay();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monitoringDay]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/departments`
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

  const displayedDay = sessionDays[currentDay]; // Get the currently displayed day
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const displayedTeachers = monitoring.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const nextDay = () => {
    if (currentDay < sessionDays.length - 1) {
      setCurrentDay(currentDay + 1); // Increment the current day index
      setCurrentPage(1); // Reset the current page when changing days
    }
  };

  const previousDay = () => {
    if (currentDay > 0) {
      setCurrentDay(currentDay - 1); // Decrement the current day index
      setCurrentPage(1); // Reset the current page when changing days
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <Select onValueChange={(value) => setDepartment(Number(value))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sélectionnez le département" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"0"} key={0}>
              Tous
            </SelectItem>
            {departments.length &&
              departments.map((item) => (
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

      <Table className="border rounded-lg">
        <TableHeader>
          <TableRow>
            <TableCell className="border text-center" rowSpan={2}>
              Enseignants
            </TableCell>

            <TableCell className="border text-center " colSpan={4}>
              <div className="flex justify-between items-center">
                <Button onClick={previousDay} variant="ghost">
                  <ArrowLeftCircle />
                </Button>
                <Button
                  variant="outline"
                  className="border-none"
                  onClick={loadExams}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    displayedDay.date
                  )}
                </Button>
                <Button onClick={nextDay} variant="ghost">
                  <ArrowRightCircle />
                </Button>
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            {displayedDay.timeSlot.map((timeSlotItem) => (
              <TableCell
                key={timeSlotItem.id}
                className="border text-center text-xs"
              >
                {timeSlotItem.period}
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedTeachers.map((teacher) => (
            <TableRow key={teacher.id} className="py-4">
              <TableCell className="border text-center">
                {teacher.firstName + " " + teacher.lastName}
              </TableCell>
              {displayedDay.timeSlot.map((timeSlotItem) => {
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
                        {monitoringLine.monitoring.exam?.moduleName ===
                        "Reservist"
                          ? "Reservist"
                          : monitoringLine.monitoring.location === null
                          ? "TT"
                          : isNaN(
                              parseInt(monitoringLine.monitoring.location?.name)
                            )
                          ? monitoringLine.monitoring.location?.name
                          : "Salle " +
                            parseInt(monitoringLine.monitoring.location?.name)}
                      </span>
                    ) : null}
                  </TableCell>
                );
              })}
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

      <div className="hidden">
        <div ref={componentRef}>
          <p className="capitalize text-xl">
            {department !== 0
              ? "Département: " +
                departments.find((dep) => dep.id == department)?.name
              : null}
          </p>
          <PrintTeacherMonitoring
            monitoring={monitoring}
            sessionDays={sessionDays}
          />
        </div>
      </div>

      <div className="hidden">
        <div ref={dayRef}>
          <p className="capitalize text-xl">
            {department !== 0
              ? "Département: " +
                departments.find((dep) => dep.id == department)?.name
              : null}
          </p>
          <PrintDayMonitoring monitoringDay={monitoringDay} />
        </div>
      </div>
    </div>
  );
};

export default TeacherMonitoring;
