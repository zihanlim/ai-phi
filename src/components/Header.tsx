"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  showBreadcrumbs?: boolean;
  breadcrumbs?: { label: string; href?: string }[];
}

export function Header({ showBreadcrumbs = false, breadcrumbs = [] }: HeaderProps) {
  const pathname = usePathname();

  const getLinkClass = (href: string) => {
    const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
    return `font-label text-[10px] uppercase tracking-widest transition-colors duration-200 ${
      isActive ? "text-primary" : "text-zinc-400 hover:text-primary"
    }`;
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-[#09090b] border-b border-[#27272a] flex justify-between items-center px-6 h-16">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-primary self-center">
          <span className="material-symbols-outlined align-middle" style={{ fontSize: '30px' }}>blur_circular</span>
        </Link>
        <h1 className="text-2xl font-headline font-bold tracking-widest text-primary uppercase">
          DIGITAL AGORA
        </h1>
      </div>
      <nav className="hidden md:flex items-center gap-6">
        <Link href="/" className={getLinkClass("/")}>
          Hub
        </Link>
        <Link href="/debate" className={getLinkClass("/debate")}>
          Debate
        </Link>
        <Link href="/dialogue" className={getLinkClass("/dialogue")}>
          Dialogue
        </Link>
        <Link href="/dossier" className={getLinkClass("/dossier")}>
          Dossier
        </Link>
        <Link href="/archive" className={getLinkClass("/archive")}>
          Archive
        </Link>
        <Link href="/settings" className={getLinkClass("/settings")}>
          Settings
        </Link>
      </nav>
      <div className="flex items-center gap-4">
        <span
          className="material-symbols-outlined text-zinc-600 cursor-not-allowed"
          title="Coming soon"
        >
          notifications
        </span>
      </div>
    </header>
  );
}
