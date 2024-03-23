import db from "@/lib/db";
import { LocationClient } from "./components/Client";

const LocationPage = async () => {
  const locations = await db.location.findMany();
  return (
    <div className="flex-1 space-y-4 pt-2">
      <LocationClient data={locations} />
    </div>
  );
};

export default LocationPage;
