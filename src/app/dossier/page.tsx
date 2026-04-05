"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LoadingDots } from "@/components/LoadingDots";
import { Breadcrumbs } from "@/components/Breadcrumbs";

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

      <main className="pt-16 pb-24 min-h-screen">
        <section className="px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <Breadcrumbs items={[{ label: "Dossier" }]} />
            <div className="flex flex-wrap gap-2 mb-8 mt-4">
              {traditions.map((tradition) => {
                const count = tradition === "All"
                  ? philosophers.length
                  : philosophers.filter((p) => p.tradition === tradition).length;
                return (
                  <button
                    key={tradition}
                    onClick={() => setSelectedTradition(tradition)}
                    className={`px-4 py-3 min-h-[44px] rounded-sm font-label text-[10px] uppercase tracking-widest transition-all focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                      selectedTradition === tradition
                        ? "bg-primary text-surface-container-lowest"
                        : "bg-surface-container text-zinc-400 hover:text-on-surface border border-outline-variant/30"
                    }`}
                    aria-label={`Filter by ${tradition}`}
                  >
                    {tradition} ({count})
                  </button>
                );
              })}
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingDots />
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
                        <button className="mt-2 font-label text-[10px] text-primary hover:underline uppercase tracking-widest">
                          Read more
                        </button>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

    </>
  );
}
