import { Heading } from "@/components/ui/heading";
import db from "@/lib/db";
import { sessionDays } from "@/lib/types";
import { format } from "date-fns";
import Schedule from "./components/Schedule";

interface ExamsPageProps {
  params: { sessionId: string };
}
const ExamsPage = async ({ params }: ExamsPageProps) => {
  const id = parseInt(params.sessionId);

  const jours = await db.day.findMany({
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
  const joursFormates: sessionDays[] = jours.map((item) => ({
    ...item,
    date: format(item.date, "dd/MM/yyyy"),
  }));

  return (
    <div className="flex-1 space-y-4 pt-2">
      <div className="flex items-center justify-between">
        <Heading
          title={`Journées (${jours.length})`}
          description="Gérer les journées"
        />
      </div>
      <Schedule sessionDays={joursFormates} sessionId={params.sessionId} />
    </div>
  );
};

export default ExamsPage;
