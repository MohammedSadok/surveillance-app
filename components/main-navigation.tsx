"use client";
import { cn } from "@/lib/utils";
import {
  Book,
  BookCheck,
  BookOpen,
  Building2,
  CalendarDays,
  Command,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
// import { MobileNav } from "./mobile-nav";

export function MainNav() {
  const path = usePathname();
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  return (
    <div className="flex gap-2 md:gap-10">
      <Link href="/" className="hidden items-center space-x-2 md:flex">
        <Command />
        <span className="hidden font-bold sm:inline-block">
          SurveillanceApp
        </span>
      </Link>
      <nav className="hidden gap-2 md:flex">
        <Link href="/sessions">
          <span
            className={cn(
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              path === "/sessions" ? "bg-accent" : "transparent"
            )}
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            <span>Sessions</span>
          </span>
        </Link>
        <Link href="/examens">
          <span
            className={cn(
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              path === "/examens" ? "bg-accent" : "transparent"
            )}
          >
            <BookCheck className="mr-2 h-4 w-4" />
            <span>Examens</span>
          </span>
        </Link>
        <Link href="/departement">
          <span
            className={cn(
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              path === "/departement" ? "bg-accent" : "transparent"
            )}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Departement</span>
          </span>
        </Link>
        <Link href="/filiere">
          <span
            className={cn(
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              path === "/filiere" ? "bg-accent" : "transparent"
            )}
          >
            <Book className="mr-2 h-4 w-4" />
            <span>Filiere</span>
          </span>
        </Link>
        <Link href="/enseignant">
          <span
            className={cn(
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              path === "/enseignant" ? "bg-accent" : "transparent"
            )}
          >
            <User className="mr-2 h-4 w-4" />
            <span>Enseignant</span>
          </span>
        </Link>
        <Link href="/locaux">
          <span
            className={cn(
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              path === "/locaux" ? "bg-accent" : "transparent"
            )}
          >
            <Building2 className="mr-2 h-4 w-4" />
            <span>Locaux</span>
          </span>
        </Link>
      </nav>
      {/* <div className="md:hidden">
        <button
          className="flex items-center space-x-2 "
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? <X /> : <Command />}
          <span className="font-bold">Menu</span>
        </button>
      </div>
      {showMobileMenu && <MobileNav />} */}
    </div>
  );
}
