import db from "@/lib/prismadb";
import { format } from "date-fns";
import { SessionClient } from "./components/Client";
import { SessionColum } from "./components/Columns";

const SessionsPage = async () => {
  const sessions = await db.sessionExam.findMany({
    orderBy: { dateDebut: "desc" },
  });

  const formattedSessions: SessionColum[] = sessions.map((item) => ({
    ...item,
    dateDebut: format(item.dateDebut, "MMMM do, yyyy"),
    dateFin: format(item.dateFin, "MMMM do, yyyy"),
  }));
  return (
    <div className="flex-1 space-y-4 pt-2">
      <SessionClient data={formattedSessions} />
    </div>
  );
};

export default SessionsPage;
