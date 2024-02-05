import { auth, signOut } from "@/auth";
const DashboardPage = async () => {
  const session = await auth();
  return (
    <div>
      <p> {JSON.stringify(session)}</p>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button>Sign out</button>
      </form>
    </div>
  );
};

export default DashboardPage;
