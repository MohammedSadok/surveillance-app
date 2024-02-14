"use client";
import { Loader } from "@/components/ui/loader";
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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExamStudentType } from "@/lib/types";
import axios from "axios";
import { FileDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { read, utils } from "xlsx";
import { Button } from "./ui/button";
type StudentsListProps = { exam: ExamStudentType };
type Student = {
  id: number;
  firstName: string;
  lastName: string;
};
const StudentsList = ({ exam }: StudentsListProps) => {
  const [data, setData] = useState<Student[]>([]);
  const componentRef = useRef<any>();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  let studentsNumber = exam.enrolledStudentsCount;
  let start = 0;
  const studentsPerLocation = exam?.Monitoring.map((item) => {
    if (item.location && item.location.size > 0) {
      const students =
        studentsNumber > item.location.size
          ? item.location.size
          : studentsNumber;
      studentsNumber -= students;
      const locationStudents = data.slice(start, start + students);
      start += students;

      // Splitting locationStudents into arrays of maximum 30 lines each
      const dividedStudents = [];
      for (let i = 0; i < locationStudents.length; i += 30) {
        dividedStudents.push(locationStudents.slice(i, i + 30));
      }

      return {
        location: item.location.name,
        students: dividedStudents,
      };
    }
  }).filter(Boolean);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    (async () => {
      const f = await axios.get(`${exam?.urlFile}`, {
        responseType: "arraybuffer",
      });
      const wb = read(f.data);
      const ws = wb.Sheets[wb.SheetNames[0]];
      const newData: Student[] = utils.sheet_to_json(ws);
      setData(newData);
    })();
  }, [exam?.urlFile]);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return data.length ? (
    <div className="flex flex-col gap-3 relative">
      <Button
        onClick={handlePrint}
        variant="ghost"
        className="absolute right-0 z-10"
      >
        <FileDown />
      </Button>

      <Table className="border rounded-lg">
        <TableHeader>
          <TableRow className="border text-center">
            {Object.keys(data[0]).map((key) => (
              <TableHead key={key} className="border text-center">
                {key}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="border text-center p-1">
                {student.id}
              </TableCell>
              <TableCell className="border text-center p-1">
                {student.firstName}
              </TableCell>
              <TableCell className="border text-center p-1">
                {student.lastName}
              </TableCell>
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
            { length: Math.ceil(exam.enrolledStudentsCount / itemsPerPage) },
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
                currentPage <
                  Math.ceil(exam.enrolledStudentsCount / itemsPerPage) &&
                handlePageChange(currentPage + 1)
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <div className="hidden">
        <div ref={componentRef}>
          {studentsPerLocation?.map((location, locationIndex) => {
            let studentNumber = 0;
            return (
              <div key={location?.location}>
                {location?.students.map((chunk, index) => (
                  <Table className="border rounded-lg h-full" key={index}>
                    <TableCaption className="caption-top text-2xl mb-2 uppercase text-bla">
                      {location?.location.toUpperCase()}
                    </TableCaption>
                    <TableHeader>
                      <TableRow className="border text-center">
                        {Object.keys(chunk[0]).map((key) => (
                          <TableHead key={key} className="border text-center">
                            {key}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {chunk.map((student, indexStudent) => (
                        <TableRow key={student.id}>
                          <TableCell className="border text-center p-1">
                            {++studentNumber}
                          </TableCell>
                          <TableCell className="border text-center p-1">
                            {student.firstName}
                          </TableCell>
                          <TableCell className="border text-center p-1">
                            {student.lastName}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ))}
                {locationIndex !== studentsPerLocation.length - 1 && (
                  <div className="pagebreak"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-1 items-center justify-center">
      <Loader />
    </div>
  );
};

export default StudentsList;
