"use client";
import { deleteUser } from "@/actions/register";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "@prisma/client";
import { Check, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { AlertModal } from "./modals/alert-modal";
type Props = {
  Users: User[];
};

const UsersTable = ({ Users }: Props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const onConfirm = async () => {
    try {
      setLoading(true);
      if (user) await deleteUser(user.id);
      toast.success("Utilisateur supprimé.");
      router.refresh();
    } catch (error) {
      toast.error("il y a une erreur essayez une autre fois !");
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };
  const handleSelect = (user: User) => {
    setUser(user);
    setOpen(true);
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <Table className="w-full border">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Name</TableHead>
            <TableHead className="text-center">Email</TableHead>
            <TableHead className="text-center">Admin</TableHead>
            <TableHead className="text-center">Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Users &&
            Users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="text-center">{user.name}</TableCell>
                <TableCell className="text-center">{user.email}</TableCell>
                <TableCell className="text-center">
                  {user.isAdmin === false ? (
                    <X className="w-5 h-5 m-auto" />
                  ) : (
                    <Check className="w-5 h-5 m-auto" />
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Button variant="outline" onClick={() => handleSelect(user)}>
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  );
};

export default UsersTable;
