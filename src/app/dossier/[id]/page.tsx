"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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

export default function PhilosopherDossierPage() {
  const params = useParams();
  const [philosopher, setPhilosopher] = useState<Philosopher | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPhilosopher() {
      try {
        const res = await fetch("/api/philosophers");
        if (res.ok) {
          const data = await res.json();
          const found = data.find((p: Philosopher) => p.id === params.id);
          setPhilosopher(found || null);
        }
      } catch {
        console.error("Failed to fetch philosopher");
      } finally {
        setLoading(false);
      }
    }
    if (params.id) {
      fetchPhilosopher();
    }
  }, [params.id]);

  if (loading) {
    return (
      <>
        <header className="fixed top-0 w-full z-50 bg-[#09090b] border-b border-[#27272a] flex justify-between items-center px-6 h-16">
          <div className="flex items-center gap-4">
            <Link href="/dossier" className="text-primary active:scale-95 transition-transform">
              <span className="material-symbols-outlined">menu</span>
            </Link>
            <h1 className="font-headline font-bold tracking-tighter uppercase text-2xl tracking-widest text-primary">
              DIGITAL AGORA
            </h1>
          </div>
          <span className="material-symbols-outlined text-primary">notifications</span>
        </header>
        <main className="pt-16 pb-32 min-h-screen flex items-center justify-center">
          <div className="flex gap-1 items-center">
            <span className="font-label text-primary text-xl blinking-cursor">_</span>
            <span className="font-label text-primary text-xl opacity-40">_</span>
            <span className="font-label text-primary text-xl opacity-20">_</span>
          </div>
        </main>
      </>
    );
  }

  if (!philosopher) {
    return (
      <>
        <header className="fixed top-0 w-full z-50 bg-[#09090b] border-b border-[#27272a] flex justify-between items-center px-6 h-16">
          <div className="flex items-center gap-4">
            <Link href="/dossier" className="text-primary active:scale-95 transition-transform">
              <span className="material-symbols-outlined">menu</span>
            </Link>
            <h1 className="font-headline font-bold tracking-tighter uppercase text-2xl tracking-widest text-primary">
              DIGITAL AGORA
            </h1>
          </div>
          <span className="material-symbols-outlined text-primary">notifications</span>
        </header>
        <main className="pt-16 pb-32 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-headline text-2xl text-primary mb-2">Philosopher not found</h2>
            <Link href="/dossier" className="text-secondary hover:underline">
              ← Back to Dossiers
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-[#09090b] border-b border-[#27272a] flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-4">
          <Link href="/dossier" className="text-primary active:scale-95 transition-transform">
            <span className="material-symbols-outlined">menu</span>
          </Link>
          <h1 className="font-headline font-bold tracking-tighter uppercase text-2xl tracking-widest text-primary">
            DIGITAL AGORA
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex gap-8 font-label text-[10px] uppercase tracking-widest">
            <Link className="text-zinc-400 hover:text-primary transition-colors duration-200" href="/archive">
              Archive
            </Link>
            <Link className="text-zinc-400 hover:text-primary transition-colors duration-200" href="/archive">
              Hub
            </Link>
            <Link className="text-zinc-400 hover:text-primary transition-colors duration-200" href="/settings">
              Settings
            </Link>
          </nav>
          <span className="material-symbols-outlined text-primary">notifications</span>
        </div>
      </header>

      <main className="pt-16 pb-32 min-h-screen">
        <section className="relative w-full h-[397px] md:h-[530px] overflow-hidden bg-surface-container-lowest">
          {philosopher.imageUrl ? (
            <img
              src={philosopher.imageUrl}
              alt={philosopher.name}
              className="w-full h-full object-cover grayscale contrast-125 opacity-60"
            />
          ) : (
            <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
              <span className="font-headline text-9xl text-zinc-600">
                {philosopher.name.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 hero-gradient" />
          <div className="absolute bottom-0 left-0 w-full px-6 pb-12 md:px-12">
            <div className="flex flex-col gap-2">
              <span className="font-label text-primary text-sm tracking-[0.3em] font-bold">
                {philosopher.era}
              </span>
              <h2 className="font-headline text-5xl md:text-8xl font-bold tracking-tighter uppercase leading-none">
                {philosopher.name.split(" ").map((word, i, arr) => (
                  <span key={i}>
                    {word}
                    {i < arr.length - 1 && <br />}
                  </span>
                ))}
              </h2>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 mt-12">
          <div className="md:col-span-4 flex flex-col gap-8">
            <div className="p-6 bg-surface-container-high border-l-2 border-primary">
              <h3 className="font-label text-[10px] uppercase tracking-[0.2em] text-outline mb-4">
                Core Identity
              </h3>
              <p className="text-xl leading-relaxed font-light text-on-surface">
                {philosopher.bio.slice(0, 150)}...
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="font-label text-[10px] uppercase tracking-[0.2em] text-outline">
                Intellectual Status
              </h3>
              <div className="flex flex-wrap gap-2">
                {philosopher.ideas.slice(0, 3).map((idea, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1 text-[10px] font-label uppercase border ${
                      i === 0
                        ? "bg-error-container/20 text-error border-error/20"
                        : i === 1
                        ? "bg-secondary-container/20 text-secondary border-secondary/20"
                        : "bg-surface-container-highest text-on-surface-variant"
                    }`}
                  >
                    {idea}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-8 flex flex-col gap-12">
            <article className="bg-surface-container p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-9xl">psychology</span>
              </div>
              <h3 className="font-headline text-3xl font-bold mb-6 tracking-tight">
                The Radical Questioning of Truth
              </h3>
              <div className="space-y-6 text-on-surface-variant leading-relaxed">
                <p>{philosopher.bio}</p>
                <p>
                  Through the concept of the{" "}
                  <span className="text-on-surface font-semibold">
                    {philosopher.ideas[0] || "intellectual framework"}
                  </span>
                  , this thinker has shaped the course of philosophical inquiry for generations.
                </p>
              </div>
              <div className="mt-8 pt-8 border-t border-outline-variant/30 flex justify-between items-center">
                <span className="font-label text-xs text-primary">SYNTHESIS COMPLETE</span>
                <span className="font-label text-[10px] text-outline">REF: Dossier_{philosopher.id}</span>
              </div>
            </article>

            <div>
              <h3 className="font-headline text-2xl font-bold mb-8 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-primary" />
                MAJOR WORKS
              </h3>
              <div className="space-y-1">
                {philosopher.works.map((work, i) => (
                  <div
                    key={i}
                    className="group flex items-center justify-between p-6 bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="font-label text-[10px] text-primary mb-1">
                        {philosopher.era.split("-")[0]}
                      </span>
                      <h4 className="font-headline text-lg uppercase font-bold tracking-tight group-hover:text-primary transition-colors">
                        {work}
                      </h4>
                    </div>
                    <span className="material-symbols-outlined text-outline group-hover:text-primary group-hover:translate-x-1 transition-all">
                      arrow_forward_ios
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-headline text-2xl font-bold mb-8 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-secondary" />
                KEY IDEAS
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {philosopher.ideas.map((idea, i) => (
                  <div
                    key={i}
                    className="bg-surface-container border border-outline-variant/10 p-6 rounded-sm hover:border-secondary/30 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-sm bg-secondary/20 flex items-center justify-center shrink-0">
                        <span className="font-headline text-secondary font-bold">
                          {i + 1}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-headline text-lg uppercase tracking-tight text-on-surface mb-2">
                          {idea}
                        </h4>
                        <p className="text-on-surface-variant text-sm leading-relaxed">
                          A fundamental concept in {philosopher.name}&apos;s philosophical framework.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 w-full z-40 p-6 md:p-8 flex flex-col md:flex-row justify-center items-center gap-4 pointer-events-none">
        <Link
          href={`/dialogue?philosopher=${philosopher.id}`}
          className="pointer-events-auto bg-primary text-surface-container-lowest px-8 py-4 rounded-sm font-headline font-bold text-lg uppercase tracking-[0.2em] flex items-center gap-3 hover:shadow-[0_0_30px_rgba(0,255,163,0.4)] transition-all active:scale-95 group"
        >
          Start Dialogue
          <span
            className="material-symbols-outlined font-bold group-hover:rotate-12 transition-transform"
            style={{ fontVariationSettings: "'wght' 700" }}
          >
            chat
          </span>
        </Link>
        <Link
          href={`/debate?philosopher=${philosopher.id}`}
          className="pointer-events-auto bg-secondary text-surface-container-lowest px-8 py-4 rounded-sm font-headline font-bold text-lg uppercase tracking-[0.2em] flex items-center gap-3 hover:shadow-[0_0_30px_rgba(105,156,255,0.4)] transition-all active:scale-95 group"
        >
          Add to Debate
          <span
            className="material-symbols-outlined font-bold group-hover:rotate-12 transition-transform"
            style={{ fontVariationSettings: "'wght' 700" }}
          >
            compare
          </span>
        </Link>
      </div>

      <nav className="md:hidden bg-surface/80 backdrop-blur-xl border-t border-outline-variant fixed bottom-0 left-0 w-full h-20 flex justify-around items-center px-4 pb-4 z-50">
        <Link
          href="/archive"
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
