import db from "@/lib/prismadb";
import { ExamClient } from "./components/Client";

type Props = {
  params: { sessionId: string; creneauId: string };
};

const ExamsPage = async ({ params }: Props) => {
  console.log("=>  ExamsPage  params:", params);
  const creneau = await db.creneau.findFirst({
    where: { id: parseInt(params.creneauId) },
    include: { journee: true },
  });
  const exams = await db.examen.findMany({
    where: {
      creneauId: parseInt(params.creneauId),
    },
    include: {
      responsable_module: true,
    },
  });
  return (
    <div className="flex-1 space-y-4 pt-2">
      <ExamClient data={exams} creneau={creneau} />
    </div>
  );
};

export default ExamsPage;
