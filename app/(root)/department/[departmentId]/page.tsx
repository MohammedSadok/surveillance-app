import db from "@/lib/prismadb";
import { TeacherClient } from "./components/Client";
interface TeacherPageProps {
  params: { departmentId: string };
}
const TeacherPage = async ({ params }: TeacherPageProps) => {
  const id = parseInt(params.departmentId);
  const teachers = await db.teacher.findMany({
    where: {
      departmentId: id,
    },
    include: {
      department: true,
    },
  });

  return (
    <div className="flex-1 space-y-4 pt-2">
      <TeacherClient data={teachers} />
    </div>
  );
};

export default TeacherPage;
