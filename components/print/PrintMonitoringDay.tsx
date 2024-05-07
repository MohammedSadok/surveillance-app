import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MonitoringDayState } from "@/lib/types";
import React, { useEffect, useState } from "react";

interface Props {
  monitoringDay: MonitoringDayState;
}

const PrintMonitoringDay: React.FC<Props> = ({ monitoringDay }) => {
  const [prevModuleName, setPrevModuleName] = useState<string | null>(null);

  useEffect(() => {
    // Reset prevModuleName when monitoringDay changes
    setPrevModuleName(null);
  }, [monitoringDay]);

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
          {Object.entries(monitoringDay).map(([localName, moduleData]) =>
            moduleData.exams.map((exam, examIndex) => {
              const moduleName =
                exam.examDetails.moduleName !== prevModuleName
                  ? exam.examDetails.moduleName
                  : prevModuleName;
              const showModuleName =
                prevModuleName === null || moduleName !== prevModuleName;
              // Update prevModuleName only if module changes
              if (showModuleName && examIndex === 0) {
                setPrevModuleName(moduleName);
              }
              return (
                <TableRow key={`${localName}-${examIndex}`}>
                  <TableCell className="border text-xs p-1">
                    {examIndex === 0 && (
                      <>
                        {showModuleName && <p>Module: {moduleName}</p>}
                        <p>S {examIndex + 1}:</p>
                        <p>
                          {exam.examDetails.moduleResponsible?.firstName}{" "}
                          {exam.examDetails.moduleResponsible?.lastName}
                        </p>
                      </>
                    )}
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
