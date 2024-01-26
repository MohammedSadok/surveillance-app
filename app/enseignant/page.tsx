import db from "@/lib/prismadb";
import { EnseignantClient } from "./components/Client";

const FilierePage = async () => {
  const enseignants = await db.enseignant.findMany({
    include: {
      departement: true,
    },
  });
  const departement = await db.departement.findMany();
  console.log("=>  FilierePage  enseignants:", enseignants);
  return (
    <div className="flex-1 space-y-4 pt-2">
      <EnseignantClient data={enseignants} departements={departement} />
    </div>
  );
};

export default FilierePage;
