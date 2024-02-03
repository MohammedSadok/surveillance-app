import db from "@/lib/db";
import { format } from "date-fns";
import { SessionClient } from "./components/Client";

const SessionsPage = async () => {
  const sessions = await db.sessionExam.findMany({
    orderBy: { id: "desc" },
  });

  return (
    <div className="flex-1 space-y-4 pt-2">
      <SessionClient data={sessions} />
    </div>
  );
};

export default SessionsPage;
