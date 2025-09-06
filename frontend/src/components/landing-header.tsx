"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PayPalLogo } from "@/components/paypal-logo";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LandingHeaderProps {
  fixed?: boolean;
  className?: string;
}

export function LandingHeader({
  fixed = true,
  className = "",
}: LandingHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const baseClasses =
    "px-4 lg:px-6 h-14 flex items-center justify-between w-full z-50 transition-all duration-300";
  const fixedClasses = fixed ? "fixed top-0 left-0 right-0" : "";
  const scrolledClasses = scrolled
    ? "bg-card border-b shadow-md"
    : "bg-transparent border-b-transparent";

  const headerClasses = cn(
    baseClasses,
    fixedClasses,
    scrolledClasses,
    className
  );

  return (
    <header className={headerClasses}>
      <Link
        href="#"
        className="flex items-center justify-center gap-2"
        prefetch={false}
      >
        <PayPalLogo className="h-7 w-7" />
        <span className="text-xl font-bold text-paypal-primary">PayClone</span>
      </Link>
      <nav className="hidden md:flex gap-4 sm:gap-6 items-center">
        <div className="flex items-center gap-2">
           <Button asChild variant="ghost">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button
            asChild
            className="bg-paypal-primary hover:bg-paypal-primary/90 text-paypal-primary-foreground rounded-full"
          >
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </nav>
       <div className="md:hidden">
         <Button asChild>
           <Link href="/login">Sign In</Link>
         </Button>
       </div>
    </header>
  );
}