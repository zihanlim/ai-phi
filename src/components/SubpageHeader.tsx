"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface SubpageHeaderProps {
  title?: string;
  showBackButton?: boolean;
  backHref?: string;
  rightElement?: React.ReactNode;
  className?: string;
}

export function SubpageHeader({
  title,
  showBackButton = true,
  backHref,
  rightElement,
  className = "",
}: SubpageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 bg-[#09090b] border-b border-[#27272a] flex justify-between items-center px-6 h-16 ${className}`}
    >
      <div className="flex items-center gap-4">
        {showBackButton && (
          <button
            onClick={handleBack}
            className="text-primary active:scale-95 transition-transform"
            aria-label="Go back"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        )}
        <h1 className="font-headline font-bold tracking-tighter uppercase text-2xl tracking-widest text-primary">
          {title || "DIGITAL AGORA"}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        {rightElement}
        <span className="material-symbols-outlined text-primary active:scale-95 transition-transform cursor-pointer">
          notifications
        </span>
      </div>
    </header>
  );
}
