import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { Navigation } from "@/components/Navigation";

export const metadata: Metadata = {
  title: "AI-Phi | Digital Agora",
  description:
    "Engage in intellectual dialogue with historical and contemporary thinkers from diverse cultural traditions worldwide.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0e0e10",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;700&family=Plus+Jakarta+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased pb-20">
        <header className="fixed top-0 w-full z-50 bg-[#09090b] border-b border-[#27272a] flex justify-between items-center px-6 h-16">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-headline font-bold tracking-widest text-primary uppercase">
              DIGITAL AGORA
            </h1>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/" className="font-label text-[10px] uppercase tracking-widest text-zinc-400 hover:text-primary transition-colors duration-200">
              Hub
            </Link>
            <Link href="/debate" className="font-label text-[10px] uppercase tracking-widest text-zinc-400 hover:text-primary transition-colors duration-200">
              Debate
            </Link>
            <Link href="/dialogue" className="font-label text-[10px] uppercase tracking-widest text-zinc-400 hover:text-primary transition-colors duration-200">
              Dialogue
            </Link>
            <Link href="/dossier" className="font-label text-[10px] uppercase tracking-widest text-zinc-400 hover:text-primary transition-colors duration-200">
              Dossiers
            </Link>
            <Link href="/archive" className="font-label text-[10px] uppercase tracking-widest text-zinc-400 hover:text-primary transition-colors duration-200">
              Archive
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-zinc-400 hover:text-primary transition-colors duration-200 cursor-pointer">
              notifications
            </span>
          </div>
        </header>
        {children}
        <Navigation />
      </body>
    </html>
  );
}
