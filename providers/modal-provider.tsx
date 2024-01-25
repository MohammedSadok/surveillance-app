"use client";

import DepartementModal from "@/components/modals/departement-modal";
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
      <DepartementModal />
      <SessionModal />
    </>
  );
};
