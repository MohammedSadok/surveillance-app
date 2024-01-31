import db from "@/lib/prismadb";
import { LocalClient } from "./components/Client";

const LocalPage = async () => {
  const locaux = await db.local.findMany();
  return (
    <div className="flex-1 space-y-4 pt-2">
      <LocalClient data={locaux} />
    </div>
  );
};

export default LocalPage;
