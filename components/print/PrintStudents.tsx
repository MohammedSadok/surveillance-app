import { PageTypeStudent } from "@/lib/types";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface Props {
  students: PageTypeStudent;
}

const PrintStudents: React.FC<Props> = ({ students }) => {
  return (
    <>
      {students?.map((location, locationIndex) => {
        let studentNumber = 0;
        return (
          <div key={location?.location.id}>
            {location?.students.map((chunk, index) => (
              <>
                <div className="mb-4">
                  <p>
                    Local: {"  "}
                    {isNaN(parseInt(location.location.name))
                      ? location.location.name
                      : "Salle " + parseInt(location.location.name)}
                  </p>
                  <p>Module: {location.exam.moduleName}</p>
                  <p>Option: {location.exam.options}</p>
                  <p>
                    Date: {"  "}
                    {format(location.timeSlot.day.date, "dd-MM-yyyy") +
                      "  " +
                      location.timeSlot.period}
                  </p>
                </div>
                <Table className="border rounded-lg h-full" key={index}>
                  <TableHeader>
                    <TableRow className="border text-center">
                      <TableHead key="numero" className="border text-center">
                        {"Numéro d'éxam"}
                      </TableHead>
                      <TableHead key="apogi" className="border text-center">
                        {"Numéro d'apogée"}
                      </TableHead>
                      <TableHead key="nom" className="border text-center">
                        Nom et prénom
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {chunk.map((student, indexStudent) => (
                      <TableRow key={student.number}>
                        <TableCell className="border text-center text-xs p-0.5">
                          {++studentNumber}
                        </TableCell>
                        <TableCell className="border text-center text-xs p-0.5">
                          {student.number}
                        </TableCell>
                        <TableCell className="border text-center text-xs p-0.5">
                          {student.firstName + " " + student.lastName}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            ))}
            {locationIndex !== students.length - 1 && (
              <div className="pagebreak"></div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default PrintStudents;
