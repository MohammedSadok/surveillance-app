import db from "@/lib/db";
import { UserClient } from "./components/Client";

const LocationPage = async () => {
  const users = await db.user.findMany();
  return (
    <div className="flex-1 space-y-4 pt-2">
      <UserClient data={users} />
    </div>
  );
};

export default LocationPage;
