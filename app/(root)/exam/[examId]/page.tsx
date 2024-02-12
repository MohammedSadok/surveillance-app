import StudentsList from "@/components/StudentsList";
import db from "@/lib/db";
import { ExamStudentType } from "@/lib/types";

type ExamPageProps = {
  params: { examId: string };
};

const ExamPage = async ({ params }: ExamPageProps) => {
  const id = parseInt(params.examId);
  const exam: ExamStudentType = await db.exam.findFirst({
    where: { id: id },
    include: { moduleResponsible: true, TimeSlot: true, Monitoring: true },
  });
  return <StudentsList exam={exam} />;
};

export default ExamPage;
