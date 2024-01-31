"use client";

import DepartementModal from "@/components/modals/departement-modal";
import EnseignantModal from "@/components/modals/enseignant-modal";
import ExamModal from "@/components/modals/exam-modal";
import LocalModal from "@/components/modals/local-modal";
import SessionModal from "@/components/modals/session-modal";
import { useEffect, useState } from "react";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <ExamModal />
      <LocalModal />
      <EnseignantModal />
      <DepartementModal />
      <SessionModal />
    </>
  );
};
