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
  return (
    <>
      {sessionDays.map((day, index) => (
        <div key={index}>
          <Table className="border rounded-lg">
            <TableHeader>
              <TableRow>
                <TableCell className="border text-center" rowSpan={2}>
                  Jours
                </TableCell>
                <TableCell className="border text-center " colSpan={4}>
                  {day.date}
                </TableCell>
              </TableRow>
              <TableRow>
                {day.timeSlot.map((timeSlotItem) => (
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
              {monitoring.map((teacher) => (
                <TableRow key={teacher.id} className="py-4">
                  <TableCell className="border text-center">
                    {teacher.firstName + " " + teacher.lastName}
                  </TableCell>
                  {day.timeSlot.map((timeSlotItem) => {
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
                              : monitoringLine.monitoring.location?.name ==
                                "AMPHITHEATER"
                              ? monitoringLine.monitoring.location?.name
                              : "Salle " +
                                monitoringLine.monitoring.location?.name}
                          </span>
                        ) : null}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Conditionally render the pagebreak div between pages */}
          {index !== sessionDays.length - 1 && (
            <div className="pagebreak"></div>
          )}
        </div>
      ))}
    </>
  );
};

export default PrintTeacherMonitoring;
