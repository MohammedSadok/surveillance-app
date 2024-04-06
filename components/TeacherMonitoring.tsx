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
  MonitoringDayState,
  TeacherMonitoringData,
  sessionDays,
} from "@/lib/types";
import { Department, TimePeriod } from "@prisma/client";
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
  const [day, setDay] = useState<{
    period: string;
    day: string;
  } | null>(null);
  const [currentRangeStart, setCurrentRangeStart] = useState(0); // Manage the current range start
  const [departments, setDepartments] = useState<Department[]>([]);
  const [department, setDepartment] = useState<number>(0);
  const [monitoring, setMonitoring] = useState<TeacherMonitoringData[]>([]);
  const [monitoringDay, setMonitoringDay] = useState<MonitoringDayState>({});
  const itemsPerPage = 25;
  const componentRef = useRef<any>();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const dayRef = useRef<any>();
  const handlePrintDay = useReactToPrint({
    content: () => dayRef.current,
  });

  const loadExams = async (id: number, type: TimePeriod) => {
    try {
      setLoading(true);
      const exams = await getMonitoringDay(id, type);

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
    if (Object.keys(monitoringDay).length !== 0) {
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

  // Calculate the end of the current range
  const currentRangeEnd = Math.min(currentRangeStart + 3, sessionDays.length);

  // Use the current range to display the days
  const displayedDays = sessionDays.slice(currentRangeStart, currentRangeEnd);

  // Update the nextDays and previousDays functions to handle ranges
  const nextDays = () => {
    if (currentRangeEnd < sessionDays.length) {
      setCurrentRangeStart(currentRangeStart + 3); // Increment the current range start
      setCurrentPage(1); // Reset the current page when changing days
    }
  };

  const previousDays = () => {
    if (currentRangeStart > 0) {
      setCurrentRangeStart(currentRangeStart - 3); // Decrement the current range start
      setCurrentPage(1); // Reset the current page when changing days
    }
  };

  // Calculate the index of the first and last teacher to be displayed on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Slice the monitoring data to get only the teachers to be displayed on the current page
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
          <TableRow key={10}>
            <TableCell className="border text-center text-xs p-0.5" rowSpan={2}>
              Enseignants
            </TableCell>

            {displayedDays.map((day, index) => (
              <TableCell
                key={day.id}
                className="border text-center p-1 text-xs relative"
                colSpan={4}
              >
                {index === 0 && (
                  <Button
                    onClick={previousDays}
                    variant="ghost"
                    className="p-2 absolute left-0 top-1/2 transform -translate-y-1/2"
                  >
                    <ArrowLeftCircle className="w-5 h-5" />
                  </Button>
                )}
                <Button
                  onClick={() => {
                    setDay({ day: day.date, period: "Matin" });
                    loadExams(day.id, "MORNING");
                  }}
                  variant="ghost"
                  className="p-0.2 text-xs mr-6"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Matin"
                  )}
                </Button>
                {day.date}
                <Button
                  onClick={() => {
                    setDay({ day: day.date, period: "Après midi" });
                    loadExams(day.id, "AFTERNOON");
                  }}
                  variant="ghost"
                  className="p-0.2 text-xs ml-6"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin " />
                  ) : (
                    "Apres Midi"
                  )}
                </Button>
                {index === 2 && (
                  <Button
                    onClick={nextDays}
                    variant="ghost"
                    className="p-2 absolute right-0 top-1/2 transform -translate-y-1/2"
                  >
                    <ArrowRightCircle className="w-5 h-5" />
                  </Button>
                )}
              </TableCell>
            ))}
          </TableRow>
          <TableRow key={11}>
            {displayedDays
              .flatMap((day) => day.timeSlot)
              .map((timeSlotItem) => (
                <TableCell
                  key={timeSlotItem.id}
                  className="border text-center text-xs p-0"
                >
                  {timeSlotItem.period}
                </TableCell>
              ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedTeachers.map((teacher, index) => (
            <TableRow key={index} className="py-4">
              <TableCell className="border text-center text-xs p-0.2">
                {teacher.firstName + " " + teacher.lastName}
              </TableCell>
              {displayedDays
                .flatMap((day) => day.timeSlot)
                .map((timeSlotItem) => {
                  const monitoringLine = teacher.monitoringLines.find(
                    (monitoringLine) =>
                      monitoringLine.monitoring.exam?.timeSlotId ===
                      timeSlotItem.id
                  );
                  return (
                    <TableCell
                      key={timeSlotItem.id}
                      className="border text-center text-xs p-0.2"
                    >
                      {monitoringLine ? (
                        <span>
                          {monitoringLine.monitoring.exam?.moduleName === "Rs"
                            ? "Rs"
                            : monitoringLine.monitoring.location === null
                            ? "TT"
                            : isNaN(
                                parseInt(
                                  monitoringLine.monitoring.location?.name
                                )
                              )
                            ? monitoringLine.monitoring.location?.name
                            : "Salle " +
                              parseInt(
                                monitoringLine.monitoring.location?.name
                              )}
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
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
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
                setCurrentPage(currentPage + 1)
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
          <h1>JOUR: {day?.day}</h1>
          <h1>SEANCE :{day?.period}</h1>
          <h1></h1>
          <PrintDayMonitoring monitoringDay={monitoringDay} />
        </div>
      </div>
    </div>
  );
};

export default TeacherMonitoring;
