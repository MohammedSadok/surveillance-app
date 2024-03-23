import { Student } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

type PageType = (
  | {
      location: string;
      students: Student[][];
    }
  | undefined
)[];
interface Props {
  students: PageType;
}

const PrintStudents: React.FC<Props> = ({ students }) => {
  return (
    <>
      {students?.map((location, locationIndex) => {
        let studentNumber = 0;
        return (
          <div key={location?.location}>
            {location?.students.map((chunk, index) => (
              <Table className="border rounded-lg h-full" key={index}>
                <TableCaption className="caption-top text-2xl mb-2 capitalize text-black">
                  {isNaN(parseInt(location.location))
                    ? location.location
                    : "Salle " + parseInt(location.location)}
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
    </>
  );
};

export default PrintStudents;
