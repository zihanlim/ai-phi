import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { SidePanelWrapper } from "@/components/SidePanelWrapper";
import { Footer } from "@/components/Footer";
import { prisma } from "@/lib/db";

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

async function getPhilosophers() {
  try {
    return await prisma.philosopher.findMany({
      orderBy: { name: "asc" },
    });
  } catch {
    return [];
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const philosophers = await getPhilosophers();

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
      <body className="min-h-screen antialiased pb-20 flex flex-col">
        <Header />
        <SidePanelWrapper philosophers={philosophers} />
        <main className="flex-1">{children}</main>
        <Footer />
        <Navigation />
      </body>
    </html>
  );
}
