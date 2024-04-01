import RegisterForm from "@/components/auth/register-form";
import UsersTable from "@/components/users-table";

import db from "@/lib/db";
import { UserClient } from "./components/Client";

const UsersPage = async () => {
  const users = await db.user.findMany();

  return (
    <div className="flex space-x-10">
      <UserClient data={users} />

      {/* <RegisterForm />
      <UsersTable Users={Users} /> */}
    </div>
  );
};
export default UsersPage;
