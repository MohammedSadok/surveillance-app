import db from "@/lib/prismadb";
import { EnseignantClient } from "./components/Client";
interface TeacherPageProps {
  params: { departementId: string };
}
const TeacherPage = async ({ params }: TeacherPageProps) => {
  const id = parseInt(params.departementId);
  const enseignants = await db.enseignant.findMany({
    where: {
      departementId: id,
    },
    include: {
      departement: true,
    },
  });
  const departement = await db.departement.findMany();
  return (
    <div className="flex-1 space-y-4 pt-2">
      <EnseignantClient data={enseignants} departements={departement} />
    </div>
  );
};

export default TeacherPage;
