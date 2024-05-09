import Schedule from "@/components/Schedule";
import TeacherMonitoring from "@/components/TeacherMonitoring";
import { Heading } from "@/components/ui/heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import db from "@/lib/db";
import { sessionDays } from "@/lib/types";
import { format } from "date-fns";

interface ExamsPageProps {
  params: { sessionId: string };
}
const ExamsPage = async ({ params }: ExamsPageProps) => {
  const id = parseInt(params.sessionId);
  const session = await db.sessionExam.findUnique({ where: { id: id } });
  const days = await db.day.findMany({
    where: {
      sessionExamId: id,
    },
    orderBy: {
      date: "asc",
    },
    include: {
      timeSlot: { include: { Exam: true } },
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
          title={`Journées (${days.length})`}
          description="Gérer les journées"
        />
      </div>
      <Tabs
        defaultValue={!session?.isValidated ? "exam" : "surveillance"}
        className="space-y-4"
      >
        <div>
          <TabsList>
            <TabsTrigger value="exam">Exam</TabsTrigger>
            <TabsTrigger value="surveillance">Surveillance</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="exam">
          <Schedule sessionDays={formattedDays} sessionId={params.sessionId} />
        </TabsContent>
        <TabsContent value="surveillance">
          <TeacherMonitoring
            sessionDays={formattedDays}
            sessionId={params.sessionId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExamsPage;
