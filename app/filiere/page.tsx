import db from "@/lib/prismadb";
import { FiliereClient } from "./components/Client";

const FilierePage = async () => {
  const filieres = await db.filiere.findMany({
    include: {
      departement: true,
    },
  });
  console.log("=>  FilierePage  filieres:", filieres);
  const departement = await db.departement.findMany();
  return (
    <div className="flex-1 space-y-4 pt-2">
      <FiliereClient data={filieres} departements={departement} />
    </div>
  );
};

export default FilierePage;
