import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MonitoringDayState } from "@/lib/types";
import React from "react";

interface Props {
  monitoringDay: MonitoringDayState;
}

const PrintMonitoringDay: React.FC<Props> = ({ monitoringDay }) => {
  return (
    <div className="space-y-3">
      <Table className="border rounded-lg">
        <TableHeader>
          <TableRow>
            <TableCell className="border text-center text-xs">Module</TableCell>
            <TableCell className="border text-center text-xs">Locale</TableCell>
            <TableCell className="border text-center text-xs">
              Surveillance
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(monitoringDay).map(([localName, moduleData], index) =>
            moduleData.exams.map((exam, examIndex) => {
              return (
                <TableRow key={`${localName}-${examIndex}`}>
                  <TableCell className="border text-xs p-1">
                    <p>Module: {exam.examDetails.moduleName}</p>
                    <p>S {examIndex + 1}:</p>
                    <p>
                      {exam.examDetails.moduleResponsible?.firstName}{" "}
                      {exam.examDetails.moduleResponsible?.lastName}
                    </p>
                  </TableCell>
                  <TableCell className="border text-center text-xs">
                    {localName}
                  </TableCell>
                  <TableCell className="border text-center text-xs">
                    {exam.teachers.join(", ")}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PrintMonitoringDay;
