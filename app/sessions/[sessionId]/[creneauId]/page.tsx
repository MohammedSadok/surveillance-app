import db from "@/lib/prismadb";
import { ExamClient } from "./components/Client";

type Props = {
  params: { sessionId: string; creneauId: string };
};

const ExamsPage = async ({ params }: Props) => {
  const creneau = await db.creneau.findFirst({
    where: { id: parseInt(params.creneauId) },
    include: { journee: true },
  });
  const exams = await db.examen.findMany({
    where: {
      creneauId: parseInt(params.sessionId),
    },
    include: {
      responsable_module: true,
    },
  });
  console.log("=>  ExamsPage  exams:", exams);
  return (
    <div className="flex-1 space-y-4 pt-2">
      <ExamClient data={exams} creneau={creneau} />
    </div>
  );
};

export default ExamsPage;
