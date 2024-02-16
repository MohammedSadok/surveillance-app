import axios from "axios";
import { Ban, CheckCircle, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import { SessionExam } from "@prisma/client";

interface CellActionProps {
  data: SessionExam;
}

type Actions = "delete" | "validate" | "cancel";

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState<Actions | null>(null);

  const onConfirm = async (confirmedAction: Actions) => {
    try {
      setLoading(true);
      const typeAction = {
        type: confirmedAction,
      };
      if (confirmedAction === "delete") {
        await axios.delete(`/api/sessions/${data.id}`);
        toast.success("Session supprimée.");
      } else if (confirmedAction === "validate") {
        await axios.post(`/api/sessions/${data.id}`, typeAction);
        toast.success("Session validée.");
      } else if (confirmedAction === "cancel") {
        await axios.post(`/api/sessions/${data.id}`, typeAction);
        toast.success("Session annulée.");
      }
      router.refresh();
    } catch (error) {
      toast.error(
        "Assurez-vous d'avoir d'abord supprimé toutes les données de cette session."
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
        onConfirm={() => {
          if (action) {
            onConfirm(action);
          }
        }}
        loading={loading}
      />

      <Button
        variant="ghost"
        onClick={() => {
          setAction("delete");
          setOpen(true);
        }}
      >
        <Trash className="h-4 w-4" color="#c1121f" />
      </Button>
      <Button
        variant="ghost"
        onClick={() => {
          setAction("validate");
          setOpen(true);
        }}
      >
        <CheckCircle className="mr-l h-4 w-4" color="#2770a5" />
      </Button>
      <Button
        variant="ghost"
        onClick={() => {
          setAction("cancel");
          setOpen(true);
        }}
      >
        <Ban className="mr-l h-4 w-4" color="#368a1c" />
      </Button>
    </>
  );
};
