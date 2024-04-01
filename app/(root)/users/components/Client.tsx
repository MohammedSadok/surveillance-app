"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useModal } from "@/hooks/useModalStore";
import { User } from "@prisma/client";
import { Plus } from "lucide-react";
import { columns } from "./Columns";
interface UserClientProps {
  data: User[];
}

export const UserClient: React.FC<UserClientProps> = ({ data }) => {
  const { onOpen } = useModal();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Utilisateurs (${data.length})`}
          description="Gérer les Utilisateur"
        />
        <Button onClick={() => onOpen("createUser")}>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un nouvel utilisateur
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};
