"use client";

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
      <SessionModal />
      {/* <StoreModal /> */}
    </>
  );
};
