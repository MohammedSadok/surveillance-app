type ExamPageProps = {
  params: { examId: string };
};

const ExamPage = ({ params }: ExamPageProps) => {
  return <div>{params.examId}</div>;
};

export default ExamPage;
