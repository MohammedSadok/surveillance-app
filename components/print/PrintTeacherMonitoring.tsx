import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TeacherMonitoringData, sessionDays } from "@/lib/types";

interface Props {
  sessionDays: sessionDays[];
  monitoring: TeacherMonitoringData[];
}

const PrintTeacherMonitoring = ({ monitoring, sessionDays }: Props) => {
  // Function to chunk the session days into groups of 5 days
  const chunkArray = (array: any[], chunkSize: number) => {
    const chunkedArray = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunkedArray.push(array.slice(i, i + chunkSize));
    }
    return chunkedArray;
  };

  const groupedDays = chunkArray(sessionDays, 4);

  return (
    <>
      {groupedDays.map((displayedDays, pageIndex) => (
        <div key={pageIndex} className="mb-3">
          <Table className="border rounded-lg">
            <TableHeader>
              <TableRow key={1}>
                <TableCell
                  className="border text-center text-xs p-0.2"
                  rowSpan={2}
                >
                  Enseignants
                </TableCell>

                {displayedDays.map((day, index) => (
                  <TableCell
                    key={day.id}
                    className="border text-center p-0.2 text-xs relative"
                    colSpan={4}
                  >
                    {day.date}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow key={2}>
                {displayedDays.map((day, index) => (
                  <>
                    <TableCell className="border text-center text-xs p-0">
                      S1
                    </TableCell>
                    <TableCell className="border text-center text-xs p-0">
                      S2
                    </TableCell>
                    <TableCell className="border text-center text-xs p-0">
                      S3
                    </TableCell>
                    <TableCell className="border text-center text-xs p-0">
                      S4
                    </TableCell>
                  </>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {monitoring.map((teacher, index) => (
                <TableRow key={index} className="py-4">
                  <TableCell className="border text-center text-[8px] p-0">
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
                          className="border text-center text-[8px] p-0"
                        >
                          {monitoringLine ? (
                            <span>
                              {monitoringLine.monitoring.exam?.moduleName ===
                              "Rs"
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
        </div>
      ))}
    </>
  );
};

export default PrintTeacherMonitoring;
