import { Heading } from "@/components/ui/heading";
import db from "@/lib/prismadb";
import { Day, Exam, TimeSlot } from "@prisma/client";
import { format } from "date-fns";
import Schedule from "./components/Schedule";
import { sessionDays } from "@/lib/types";

interface ExamsPageProps {
  params: { sessionId: string };
}
const ExamsPage = async ({ params }: ExamsPageProps) => {
  const id = parseInt(params.sessionId);

  const days = await db.day.findMany({
    where: {
      sessionExamId: id,
    },
    orderBy: {
      date: "asc",
    },
    include: {
      timeSlot: {
        include: {
          Exam: true,
        },
      },
    },
  });
  const formattedDays: sessionDays[] = days.map((item) => ({
    ...item,
    date: format(item.date, "dd/MM/yyyy"),
  }));

  return (
    <div className="flex-1 space-y-4 pt-2">
      <div className="flex items-center justify-between">
        <Heading
          title={`Journee (${days.length})`}
          description="Manage Journee"
        />
      </div>
      <Schedule sessionDays={formattedDays} sessionId={params.sessionId} />
    </div>
  );
};

export default ExamsPage;
