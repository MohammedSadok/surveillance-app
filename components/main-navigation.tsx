"use client";
import { cn } from "@/lib/utils";
import { BookOpen, Building2, CalendarDays, Command } from "lucide-react";
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
        <Link href="/department">
          <span
            className={cn(
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              path === "/department" ? "bg-accent" : "transparent"
            )}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Departements</span>
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
