import { Metadata } from "next";

import scheduleImage from "@/assets/images/schedule.png";
import RegisterForm from "@/components/auth/register-form";
import { ModeToggle } from "@/components/mode-toggle";
import Image from "next/image";
export const metadata: Metadata = {
  title: "Authentification",
  description:
    "Formulaires d'authentification construits à l'aide des composants.",
};

export default function AuthenticationPage() {
  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="flex space-x-2 absolute right-4 top-4 md:right-8 md:top-8 justify-center">
        <ModeToggle />
      </div>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Acme Inc
        </div>
        <div className="w-full h-1/2 relative mt-auto">
          <Image
            src={scheduleImage}
            fill={true}
            alt={""}
            style={{
              objectFit: "contain",
            }}
          />
        </div>
        <div className="relative  mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg text-justify">
              Notre plateforme constitue une solution intégrale dédiée à la
              supervision des salles d'examen. Bénéficiez d'un processus
              d'authentification sécurisé spécifiquement conçu pour les
              administrateurs, favorisant une surveillance efficiente des
              examens
            </p>
            <footer className="text-sm">FS Eljadida</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Connexion</h1>
            <p className="text-sm text-muted-foreground">
              Entrez votre adresse e-mail ci-dessous pour créer votre compte
            </p>
          </div>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}