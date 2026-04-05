"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { LoadingDots } from "@/components/LoadingDots";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { philosopherContent } from "@/lib/philosopher-content";

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
  const router = useRouter();
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
        <main className="pt-16 pb-32 min-h-screen flex items-center justify-center">
          <LoadingDots />
        </main>
      </>
    );
  }

  if (!philosopher) {
    return (
      <>
        <main className="pt-16 pb-32 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <span className="material-symbols-outlined text-6xl text-zinc-600 mb-4 block">
              search_off
            </span>
            <h2 className="font-headline text-2xl text-primary mb-2">Philosopher not found</h2>
            <p className="text-on-surface-variant text-sm mb-6">
              The philosopher you are looking for does not exist or has been removed.
            </p>
            <Link href="/dossier" className="text-primary font-label text-[10px] uppercase tracking-widest hover:underline">
              ← Back to Dossiers
            </Link>
          </div>
        </main>
      </>
    );
  }

  const content = philosopherContent[philosopher.id];
  const tagline = content?.tagline || `The Philosophy of ${philosopher.name}`;
  const workDescriptions = content?.workDescriptions || {};
  const ideaDescriptions = content?.ideaDescriptions || {};
  const quotes = content?.quotes || [];
  const traditionContext = content?.traditionContext || "";

  return (
    <>

      <main className="pt-16 pb-40 md:pb-32 min-h-screen">
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
          <div className="absolute top-0 left-0 w-full px-6 pt-20 md:pt-24">
            <button
              onClick={() => router.push("/dossier")}
              className="text-primary active:scale-95 transition-transform"
              aria-label="Go back"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
          </div>
          <div className="absolute bottom-0 left-0 w-full px-6 pb-12 md:px-12">
            <Breadcrumbs items={[{ label: "Dossier", href: "/dossier" }, { label: philosopher.name }]} />
            <div className="flex flex-col gap-2 mt-4">
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
              <p className="text-primary/80 text-sm md:text-base font-body italic mt-2 max-w-xl">
                &ldquo;{tagline}&rdquo;
              </p>
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
                {tagline}
              </h3>
              <div className="space-y-6 text-on-surface-variant leading-relaxed">
                <p>{philosopher.bio}</p>
                {traditionContext && (
                  <p className="border-l-2 border-primary/30 pl-4 italic">
                    {traditionContext}
                  </p>
                )}
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
                      {workDescriptions[work] && (
                        <p className="text-on-surface-variant text-sm mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {workDescriptions[work]}
                        </p>
                      )}
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
                        {ideaDescriptions[idea] && (
                          <p className="text-on-surface-variant text-sm leading-relaxed">
                            {ideaDescriptions[idea]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {quotes.length > 0 && (
              <div>
                <h3 className="font-headline text-2xl font-bold mb-8 flex items-center gap-3">
                  <span className="w-8 h-[2px] bg-tertiary" />
                  PHILOSOPHICAL REFLECTIONS
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quotes.map((quote, i) => (
                    <blockquote
                      key={i}
                      className="bg-surface-container border-l-4 border-tertiary p-6 rounded-sm"
                    >
                      <p className="text-on-surface-variant italic leading-relaxed">
                        &ldquo;{quote}&rdquo;
                      </p>
                    </blockquote>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <div className="fixed bottom-20 md:bottom-0 left-0 w-full z-40 p-6 md:p-8 flex flex-col md:flex-row justify-center items-center gap-4 pointer-events-none">
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

    </>
  );
}