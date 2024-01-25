import db from "@/lib/prismadb";
import { DepartementClient } from "./components/Client";

const DepartementPage = async () => {
  const departements = await db.departement.findMany({});

  return (
    <div className="flex-1 space-y-4 pt-2">
      <DepartementClient data={departements} />
    </div>
  );
};

export default DepartementPage;
