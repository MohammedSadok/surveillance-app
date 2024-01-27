import { Heading } from "@/components/ui/heading";
import db from "@/lib/prismadb";
import { Examen } from "@prisma/client";
import { format } from "date-fns";
import Schedule from "./components/Schedule";
type Creneau = {
  id: string;
  heureDebut: string;
  heureFin: string;
  journeeId: string;
  Examen: Examen;
};
export type Jour = {
  id: string;
  date: string;
  Creneau: Creneau[];
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
    include: {
      Creneau: {
        include: {
          Examen: true,
        },
      },
    },
  });
  const formattedJournees: Jour[] = journees.map((item) => ({
    ...item,
    date: format(item.date, "MM/dd/yyyy"),
  }));
  console.log(
    "=>  constformattedJournees:Jour[]=journees.map  formattedJournees:",
    formattedJournees
  );

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
