"use client";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getStudentsForExam } from "@/data/exam";
import { ExamStudentType, ExamType, Student } from "@/lib/types";

import axios from "axios";
import { FileDown, Loader2, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useReactToPrint } from "react-to-print";
interface CellActionProps {
  data: ExamType;
}
type PageType = (
  | {
      location: string;
      students: Student[][];
    }
  | undefined
)[];
export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const componentRef = useRef<any>();
  const [students, setStudents] = useState<PageType>();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  useEffect(() => {
    if (students && students.length > 0) {
      handlePrint();
    }
  }, [students, handlePrint]);
  const onConfirm = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/exams/${data.id}`);
      toast.success("Examen supprimé.");
      router.refresh();
    } catch (error) {
      toast.error("Assurez-vous d'avoir d'abord supprimé tous .");
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };
  const loadStudents = async () => {
    try {
      setLoading(true);
      const exam: ExamStudentType | null = await getStudentsForExam(data.id);
      if (exam) {
        let studentsNumber = exam.enrolledStudentsCount;
        let start = 0;
        const studentsPerLocation = exam?.Monitoring.map((item) => {
          if (item.location && item.location.size > 0) {
            const students =
              studentsNumber > item.location.size
                ? item.location.size
                : studentsNumber;
            studentsNumber -= students;
            const locationStudents = exam.students.slice(
              start,
              start + students
            );
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
        setStudents(studentsPerLocation);
        setLoading(false);
        handlePrint();
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setLoading(false);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <div className="">
        <Button variant="ghost" onClick={() => setOpen(true)}>
          <Trash className="h-4 w-4 " color="#c1121f" />
        </Button>

        <Button onClick={loadStudents} variant="ghost" disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="hidden">
        <div ref={componentRef}>
          {students?.map((location, locationIndex) => {
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
                        <TableRow key={student.number}>
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
                {locationIndex !== students.length - 1 && (
                  <div className="pagebreak"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
