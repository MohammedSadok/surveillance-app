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
      {sessionDays.map((day, index) => {
        // Filter teachers who have monitoring data for this day
        const teachersWithMonitoring = monitoring.filter((teacher) =>
          teacher.monitoringLines.some((monitoringLine) =>
            day.timeSlot.some(
              (timeSlotItem) =>
                monitoringLine.monitoring.exam?.timeSlotId === timeSlotItem.id
            )
          )
        );
        // Render table only if there are teachers with monitoring data for this day
        if (teachersWithMonitoring.length > 0) {
          return (
            <div key={index}>
              <Table className="border rounded-lg mb-3">
                <TableHeader>
                  <TableRow>
                    <TableCell className="border text-center" rowSpan={2}>
                      Enseignants
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
                  {teachersWithMonitoring.map((teacher) => (
                    <TableRow key={teacher.id} className="py-4">
                      <TableCell className="border text-center text-xs p-1">
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
                            className="border text-center text-xs p-1"
                          >
                            {monitoringLine ? (
                              <span>
                                {monitoringLine.monitoring.exam?.moduleName ===
                                "Reservist"
                                  ? "Reservist"
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
          );
        } else {
          return null;
        }
      })}
    </>
  );
};
export default PrintTeacherMonitoring;
