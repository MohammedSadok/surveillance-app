import StudentsList from "@/components/StudentsList";
import db from "@/lib/db";

type ExamPageProps = {
  params: { examId: string };
};

const ExamPage = async ({ params }: ExamPageProps) => {
  const id = parseInt(params.examId);
  const exam = await db.exam.findUnique({
    where: { id: id },
    include: {
      moduleResponsible: true,
      TimeSlot: true,
      Monitoring: { include: { location: true } },
    },
  });
  if (exam) {
    return <StudentsList exam={exam} />;
  }
  return null;
};

export default ExamPage;
