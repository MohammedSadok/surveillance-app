import { Heading } from "@/components/ui/heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMonitoring } from "@/data/session";
import db from "@/lib/db";
import { TeacherMonitoringData, sessionDays } from "@/lib/types";
import { format } from "date-fns";
import Schedule from "./components/Schedule";
import TeacherMonitoring from "./components/TeacherMonitoring";

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
      timeSlot: true,
    },
  });
  const formattedDays: sessionDays[] = days.map((item) => ({
    ...item,
    date: format(item.date, "dd/MM/yyyy"),
  }));

  const monitoring: TeacherMonitoringData[] = await getMonitoring(1);

  return (
    <div className="flex-1 space-y-4 pt-2">
      <div className="flex items-center justify-between">
        <Heading
          title={`Journées (${days.length})`}
          description="Gérer les journées"
        />
      </div>
      <Tabs defaultValue="manage" className="space-y-4">
        <TabsList>
          <TabsTrigger value="manage">Manage</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>
        <TabsContent value="manage">
          <Schedule sessionDays={formattedDays} sessionId={params.sessionId} />
        </TabsContent>
        <TabsContent value="overview">
          <TeacherMonitoring
            sessionDays={formattedDays}
            sessionId={params.sessionId}
            monitoring={monitoring}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExamsPage;
