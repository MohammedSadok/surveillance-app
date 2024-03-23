import RegisterForm from "@/components/auth/register-form";
import UsersTable from "@/components/users-table";

import db from "@/lib/db";

const UsersPage = async () => {
  const Users = await db.user.findMany();

  return (
    <div className="flex space-x-10">
      <RegisterForm />
      <UsersTable Users={Users} />
    </div>
  );
};
export default UsersPage;
