import db from "@/lib/db";
import { ExamClient } from "./components/Client";

type Props = {
  params: { sessionId: string; timeSlotId: string };
};

const ExamsPage = async ({ params }: Props) => {
  const timeSlot = await db.timeSlot.findFirst({
    where: { id: parseInt(params.timeSlotId) },
    include: { day: true },
  });
  const exams = await db.exam.findMany({
    where: {
      timeSlotId: parseInt(params.timeSlotId),
    },
    include: {
      moduleResponsible: true,
    },
  });
  return (
    <div className="flex-1 space-y-4 pt-2">
      <ExamClient data={exams} timeSlot={timeSlot} />
    </div>
  );
};

export default ExamsPage;
