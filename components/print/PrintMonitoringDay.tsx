import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MonitoringExam } from "@/lib/types";
import React from "react";

interface Props {
  monitoringDay: MonitoringExam[];
}

const PrintMonitoringDay = ({ monitoringDay }: Props) => {
  return (
    <div className="space-y-3">
      {monitoringDay.map((monitoring) => (
        <div key={monitoring.id}>
          <div>
            <h2>Module: {monitoring.moduleName}</h2>
            <h2>
              Responsable du module :
              <span className="font-bold">
                {monitoring.moduleResponsible.firstName +
                  " " +
                  monitoring.moduleResponsible.lastName}
              </span>
            </h2>
            <h2>
              Numero de Telephone :
              <span className="font-bold">
                {monitoring.moduleResponsible.phoneNumber}
              </span>
            </h2>
          </div>
          <Table className="border rounded-lg">
            <TableHeader>
              <TableRow>
                <TableCell className="border text-center">local</TableCell>
                <TableCell className="border text-center" colSpan={3}>
                  Ensignants
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monitoring.Monitoring.map((line, index) => (
                <TableRow className="py-4" key={index}>
                  <React.Fragment>
                    {line.location && (
                      <TableCell className="border text-center text-s">
                        {line.location?.name == "AMPHITHEATER"
                          ? line.location?.name
                          : "Salle " + line.location?.name}
                      </TableCell>
                    )}
                    {line.monitoringLines.map((teacher, index) => (
                      <React.Fragment key={index}>
                        {line.location && (
                          <TableCell
                            key={`${line.id}-${index}`}
                            className="border text-center text-s"
                          >
                            {teacher.teacher.firstName +
                              " " +
                              teacher.teacher.lastName}
                          </TableCell>
                        )}
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
};

export default PrintMonitoringDay;
