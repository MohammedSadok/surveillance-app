"use client";

import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { SessionExam } from "@prisma/client";

interface CellActionProps {
  data: SessionExam;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onConfirm = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/sessions/${data.id}`);
      toast.success("Session supprimée.");
      router.refresh();
    } catch (error) {
      toast.error(
        "Assurez-vous d'avoir d'abord supprimé toutes les jours de cette session."
      );
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />

      <Button variant="ghost" onClick={() => setOpen(true)}>
        <Trash className="mr-2 h-4 w-4" color="#c1121f" />
      </Button>
    </>
  );
};
