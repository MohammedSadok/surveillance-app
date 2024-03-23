import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ExamType } from "@/lib/types";
type ResentExamsProps = {
  lastExams: ExamType[];
};
export const RecentExams = ({ lastExams }: ResentExamsProps) => {
  return (
    <div className="space-y-8">
      {lastExams.map((exam) => (
        <div className="flex items-center" key={exam.id}>
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {exam.moduleResponsible?.firstName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {exam.moduleResponsible?.firstName +
                " " +
                exam.moduleResponsible?.lastName}
            </p>
            <p className="text-sm text-muted-foreground">
              {exam.moduleResponsible?.email}
            </p>
          </div>
          <div className="ml-auto font-medium flex flex-col">
            <p className="ml-auto">{exam.moduleName.toUpperCase()}</p>
            <p className="ml-auto text-sm text-muted-foreground">
              {exam.options + " : " + exam.enrolledStudentsCount + " etudiants"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
