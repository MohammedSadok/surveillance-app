import { auth } from "@/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import db from "@/lib/db";
import { ExamType } from "@/lib/types";
import { format } from "date-fns";
import { Metadata } from "next";
import { Overview } from "./components/overview";
import { RecentExams } from "./components/recent-sales";

export const metadata: Metadata = {
  title: "Tableau de bord",
  description:
    "Application de tableau de bord d'exemple utilisant les composants.",
};

const DashboardPage = async () => {
  const session = await auth();
  const lastSession = await db.sessionExam.findFirst({
    orderBy: { id: "desc" },
  });
  const sessionDays = await db.day.findMany({
    where: {
      sessionExamId: lastSession?.id,
    },
    include: {
      timeSlot: { include: { Exam: true } },
    },
  });
  const examsPerDay = sessionDays.map((day) => ({
    day: format(day.date, "LLL dd, y"),
    total: day.timeSlot.reduce(
      (acc, timeSlot) => acc + timeSlot.Exam.length,
      0
    ),
  }));
  const totalMonitoring = await db.monitoringLine.aggregate({
    _count: {
      id: true,
    },
    where: {
      monitoring: {
        exam: { TimeSlot: { day: { sessionExamId: lastSession?.id } } },
      },
    },
  });
  const numberOfExams = await db.exam.count();
  const lastExams: ExamType[] = await db.exam.findMany({
    take: 5,
    include: { moduleResponsible: true },
    orderBy: { id: "desc" },
  });
  const numberOfTeachers = await db.teacher.count();
  const numberOfDepartments = await db.department.count();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Sessions`} description="Gérer les sessions" />
      </div>
      <Separator className="my-4" />
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Nombre total d'examens
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{numberOfExams}</div>
              <p className="text-xs text-muted-foreground">
                +20.1% par rapport au mois dernier
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Nombre total d'enseignants
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{numberOfTeachers}</div>
              <p className="text-xs text-muted-foreground">
                +180.1% par rapport au mois dernier
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Nombre total de départements
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{numberOfDepartments}</div>
              <p className="text-xs text-muted-foreground">
                +19% par rapport au mois dernier
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Surveillance actuelle
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(totalMonitoring._count.id / numberOfTeachers).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                +201 depuis la dernière heure
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Aperçu</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview data={examsPerDay} />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Ventes récentes</CardTitle>
              <CardDescription>
                Vous avez effectué 265 ventes ce mois-ci.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentExams lastExams={lastExams} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
