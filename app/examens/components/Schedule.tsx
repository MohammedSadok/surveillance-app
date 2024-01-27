"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { day } from "@/constants";
import { PlusCircle } from "lucide-react";
import { Jour } from "../page";

interface ScheduleProps {
  days: Jour[];
}

const Schedule: React.FC<ScheduleProps> = ({ days }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Table className="border rounded-lg">
      <TableHeader>
        <TableRow>
          <TableCell className="border text-center" rowSpan={2}>
            Jours
          </TableCell>
          {day.map((dayItem, index) => (
            <React.Fragment key={index}>
              <TableCell
                key={index * 2}
                className="border text-center"
                colSpan={2}
              >
                {Object.keys(dayItem)[0]}
              </TableCell>
            </React.Fragment>
          ))}
        </TableRow>
        <TableRow>
          {day.map((dayItem, index) => (
            <React.Fragment key={index}>
              {Object.values(dayItem)[0].map((hour, hourIndex) => (
                <TableCell
                  key={index * 2 + hourIndex}
                  className="border text-center"
                >
                  {hour}
                </TableCell>
              ))}
            </React.Fragment>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {days.map((item) => (
          <TableRow key={item.id} className="py-4">
            <TableCell className="border text-center">{item.date}</TableCell>
            {item.Creneau.map((crenauItem) => (
              <TableCell key={crenauItem.id} className="border text-center">
                <Button className="" variant="ghost">
                  {/* {crenauItem.id} */}
                  <PlusCircle />
                </Button>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Schedule;
