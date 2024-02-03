import db from "@/lib/prismadb";
import { ExamClient } from "./components/Client";

type Props = {
  params: { sessionId: string; creneauId: string };
};

const ExamsPage = async ({ params }: Props) => {
  console.log("=>  ExamsPage  params:", params);
  const timeSlot = await db.timeSlot.findFirst({
    where: { id: parseInt(params.creneauId) },
    include: { day: true },
  });
  const exams = await db.exam.findMany({
    where: {
      timeSlotId: parseInt(params.creneauId),
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
