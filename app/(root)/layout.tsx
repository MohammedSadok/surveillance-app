import { MainNav } from "@/components/main-navigation";

import { ModalProvider } from "@/providers/modal-provider";
import { ToastProvider } from "@/providers/toast-provider";
import React from "react";
import { UserNav } from "../../components/user-nav";
const pagesLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav />
          <div className="flex justify-center items-center space-x-2">
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex w-full flex-1 flex-col overflow-hidden container">
        <ToastProvider />
        <ModalProvider />
        {children}
      </main>
    </div>
  );
};

export default pagesLayout;
