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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExamStudentType } from "@/lib/types";
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
  const componentRef = useRef<any>();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [data, setData] = useState<Student[]>([]);
  const [location, setLocation] = useState<number>();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Function to split data into chunks
  const chunkArray = (arr: Student[], chunkSize: number) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
  };

  // Split data into chunks of 30
  const chunkedData = chunkArray(data, 30);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    (async () => {
      const f = await fetch(`${exam?.urlFile}`);
      const ab = await f.arrayBuffer();
      const wb = read(ab);
      const ws = wb.Sheets[wb.SheetNames[0]];
      const newData: Student[] = utils.sheet_to_json(ws);
      console.log("=>  newData:", newData);
      setData(newData);
    })();
  }, [exam?.urlFile]);
  return data.length ? (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <Select onValueChange={(value) => setLocation(Number(value))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sélectionnez le département" />
          </SelectTrigger>
          <SelectContent>
            {exam?.Monitoring.map((item) => (
              <SelectItem value={item.id.toString()} key={item.id}>
                {item.locationId}
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
            { length: Math.ceil(data.length / itemsPerPage) },
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
                currentPage < Math.ceil(data.length / itemsPerPage) &&
                handlePageChange(currentPage + 1)
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <div className="hidden">
        <div ref={componentRef}>
          {chunkedData.map((chunk, index) => (
            <Table className="border rounded-lg page-break" key={index}>
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
                {chunk.map((student) => (
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
          ))}
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
