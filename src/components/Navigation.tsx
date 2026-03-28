"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Hub", icon: "grid_view" },
  { href: "/debate", label: "Debate", icon: "groups" },
  { href: "/dialogue", label: "Dialogue", icon: "chat" },
  { href: "/dossier", label: "Dossier", icon: "menu_book" },
  { href: "/archive", label: "Archive", icon: "history_edu" },
  { href: "/settings", label: "Settings", icon: "settings" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full h-20 bg-surface/80 backdrop-blur-xl border-t border-outline-variant flex justify-around items-center px-4 pb-4 z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center transition-all active:scale-90 ${
              isActive
                ? "text-primary drop-shadow-[0_0_8px_rgba(0,255,163,0.3)]"
                : "text-zinc-500 hover:text-zinc-200"
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              {item.icon}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest mt-1">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
