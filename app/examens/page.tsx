import { Heading } from "@/components/ui/heading";
import db from "@/lib/prismadb";
import { format } from "date-fns";
import Schedule from "./components/Schedule";
export type Jour = {
  id: string;
  date: string;
};
const SessionsPage = async () => {
  const lastSession = await db.sessionExam.findFirst({
    orderBy: {
      dateDebut: "desc",
    },
  });

  const journees = await db.journee.findMany({
    where: {
      sessionExamId: lastSession?.id,
    },
  });
  const formattedJournees: Jour[] = journees.map((item) => ({
    ...item,
    date: format(item.date, "MM/dd/yyyy"),
  }));

  return (
    <div className="flex-1 space-y-4 pt-2">
      <div className="flex items-center justify-between">
        <Heading
          title={`Journee (${journees.length})`}
          description="Manage Journee"
        />
      </div>
      <Schedule days={formattedJournees} />
    </div>
  );
};

export default SessionsPage;
