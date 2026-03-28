"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Philosopher {
  id: string;
  name: string;
  era: string;
  tradition: string;
  bio: string;
  works: string[];
  ideas: string[];
  imageUrl?: string;
}

const traditions = ["All", "Western", "Eastern", "African", "Middle Eastern", "Latin American"];

export default function DossierPage() {
  const [philosophers, setPhilosophers] = useState<Philosopher[]>([]);
  const [selectedTradition, setSelectedTradition] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPhilosophers() {
      try {
        const res = await fetch("/api/philosophers");
        if (res.ok) {
          const data = await res.json();
          setPhilosophers(data);
        }
      } catch {
        console.error("Failed to fetch philosophers");
      } finally {
        setLoading(false);
      }
    }
    fetchPhilosophers();
  }, []);

  const filteredPhilosophers =
    selectedTradition === "All"
      ? philosophers
      : philosophers.filter((p) => p.tradition === selectedTradition);

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-[#09090b] border-b border-[#27272a] flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-4">
          <button className="text-primary active:scale-95 transition-transform">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1 className="font-headline font-bold tracking-tighter uppercase text-2xl tracking-widest text-primary">
            DIGITAL AGORA
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-8 font-label text-[10px] uppercase tracking-widest">
            <Link className="text-zinc-400 hover:text-primary transition-colors duration-200" href="/">
              Hub
            </Link>
            <Link className="text-zinc-400 hover:text-primary transition-colors duration-200" href="/archive">
              Archive
            </Link>
            <Link className="text-zinc-400 hover:text-primary transition-colors duration-200" href="/settings">
              Settings
            </Link>
          </nav>
          <span className="material-symbols-outlined text-primary active:scale-95 transition-transform cursor-pointer">
            notifications
          </span>
        </div>
      </header>

      <main className="pt-20 pb-24 min-h-screen">
        <section className="px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-8">
              {traditions.map((tradition) => (
                <button
                  key={tradition}
                  onClick={() => setSelectedTradition(tradition)}
                  className={`px-4 py-2 rounded-sm font-label text-[10px] uppercase tracking-widest transition-all ${
                    selectedTradition === tradition
                      ? "bg-primary text-surface-container-lowest"
                      : "bg-surface-container text-zinc-400 hover:text-on-surface border border-outline-variant/30"
                  }`}
                >
                  {tradition}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="flex gap-1 items-center">
                  <span className="font-label text-primary text-xl blinking-cursor">_</span>
                  <span className="font-label text-primary text-xl opacity-40">_</span>
                  <span className="font-label text-primary text-xl opacity-20">_</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPhilosophers.map((philosopher) => (
                  <Link key={philosopher.id} href={`/dossier/${philosopher.id}`}>
                    <article className="bg-surface-container border border-outline-variant/10 rounded-sm overflow-hidden group cursor-pointer hover:border-primary/30 transition-all">
                      <div className="h-48 relative overflow-hidden">
                        {philosopher.imageUrl ? (
                          <img
                            src={philosopher.imageUrl}
                            alt={philosopher.name}
                            className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                            <span className="font-headline text-6xl text-zinc-600">
                              {philosopher.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-headline text-lg uppercase tracking-tight">
                                {philosopher.name}
                              </p>
                              <p className="font-label text-[9px] text-zinc-500">
                                {philosopher.era}
                              </p>
                            </div>
                            <span className="material-symbols-outlined text-zinc-500 group-hover:text-primary group-hover:translate-x-1 transition-all">
                              arrow_forward_ios
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <span className="font-label text-[10px] text-secondary uppercase tracking-widest">
                          {philosopher.tradition}
                        </span>
                        <p className="text-on-surface-variant text-sm mt-2 line-clamp-2">
                          {philosopher.bio}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 w-full h-20 bg-surface/80 backdrop-blur-xl border-t border-outline-variant flex justify-around items-center px-4 pb-4 z-50">
        <Link
          href="/"
          className="flex flex-col items-center justify-center text-zinc-500 hover:text-zinc-200 active:scale-90 transition-all"
        >
          <span className="material-symbols-outlined">grid_view</span>
          <span className="font-mono text-[10px] uppercase tracking-widest mt-1">Hub</span>
        </Link>
        <Link
          href="/archive"
          className="flex flex-col items-center justify-center text-zinc-500 hover:text-zinc-200 active:scale-90 transition-all"
        >
          <span className="material-symbols-outlined">history_edu</span>
          <span className="font-mono text-[10px] uppercase tracking-widest mt-1">Archive</span>
        </Link>
        <Link
          href="/settings"
          className="flex flex-col items-center justify-center text-zinc-500 hover:text-zinc-200 active:scale-90 transition-all"
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="font-mono text-[10px] uppercase tracking-widest mt-1">Settings</span>
        </Link>
      </nav>
    </>
  );
}
