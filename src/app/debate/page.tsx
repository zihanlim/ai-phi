"use client";

import { useState } from "react";
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

interface Argument {
  id: string;
  philosopherId: string;
  philosopherName: string;
  tradition: string;
  argumentType: string;
  content: string[];
  references: string[];
  alignment?: number;
}

const mockPhilosophers: Philosopher[] = [
  {
    id: "aristotle",
    name: "Aristotle",
    era: "384-322 BCE",
    tradition: "Classical Virtue",
    bio: "Greek philosopher who wrote on ethics, politics, logic, and biology.",
    works: ["Nicomachean Ethics", "Politics", "Metaphysics"],
    ideas: ["Golden mean", "Teleology", "Virtue ethics"],
    imageUrl: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&q=80",
  },
  {
    id: "machiavelli",
    name: "Machiavelli",
    era: "1469-1527",
    tradition: "Political Realism",
    bio: "Italian diplomat and philosopher known for The Prince.",
    works: ["The Prince", "Discourses on Livy"],
    ideas: ["Necessità", "Raison d'État", "Political realism"],
    imageUrl: "https://images.unsplash.com/photo-1607705703571-c5a8695f18f6?w=400&q=80",
  },
];

const mockArguments: Argument[] = [
  {
    id: "1",
    philosopherId: "aristotle",
    philosopherName: "Aristotle",
    tradition: "Classical Virtue",
    argumentType: "Teleological Ethics",
    content: [
      "Politics is the master art of the highest good. The state exists not merely for life, but for the good life. If a ruler pursues power as an end, they cease to be a statesman and become a tyrant.",
      "True authority stems from virtuous character. A leader must embody the golden mean, for any action taken through cruelty or deceit fractures the social teleology that binds citizens together.",
    ],
    references: ["Eudaimonia", "The Golden Mean"],
    alignment: 74.2,
  },
  {
    id: "2",
    philosopherId: "machiavelli",
    philosopherName: "Machiavelli",
    tradition: "Political Realism",
    argumentType: "Pragmatic Realism",
    content: [
      "The gap between how one lives and how one ought to live is so wide that a man who neglects what is done for what ought to be done learns his ruin.",
      "A prince must be both a lion and a fox. To maintain the stability of the state, he must often act against faith, against charity, and against humanity. Virtue in politics is not morality, but effective agency.",
    ],
    references: ["Necessità", "Raison d'État"],
    alignment: 74.2,
  },
];

export default function DebatePage() {
  const [showSynthesis, setShowSynthesis] = useState(false);

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
        <div className="flex items-center gap-4">
          <span className="font-label text-[10px] text-zinc-500 uppercase tracking-[0.2em] hidden md:block">
            Session: Logic_Matrix_042
          </span>
          <button className="text-primary active:scale-95 transition-transform">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </header>

      <main className="pt-16 pb-32 min-h-screen">
        <section className="relative h-48 md:h-64 flex overflow-hidden border-b border-outline-variant/20">
          <div className="relative flex-1 bg-surface-container-low flex flex-col justify-center items-start px-8 md:px-16 overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <img
                src={mockPhilosophers[0].imageUrl}
                alt={mockPhilosophers[0].name}
                className="w-full h-full object-cover grayscale"
              />
            </div>
            <div className="relative z-10">
              <span className="font-label text-primary text-xs tracking-widest uppercase mb-2 block">
                {mockPhilosophers[0].tradition}
              </span>
              <h2 className="font-headline font-bold text-4xl md:text-6xl tracking-tighter italic">
                {mockPhilosophers[0].name}
              </h2>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="h-full w-px bg-primary/20 rotate-[20deg] scale-y-150" />
          </div>

          <div className="relative flex-1 bg-surface flex flex-col justify-center items-end px-8 md:px-16 overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <img
                src={mockPhilosophers[1].imageUrl}
                alt={mockPhilosophers[1].name}
                className="w-full h-full object-cover grayscale"
              />
            </div>
            <div className="relative z-10 text-right">
              <span className="font-label text-secondary text-xs tracking-widest uppercase mb-2 block">
                {mockPhilosophers[1].tradition}
              </span>
              <h2 className="font-headline font-bold text-4xl md:text-6xl tracking-tighter">
                {mockPhilosophers[1].name}
              </h2>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-0 relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-outline-variant/10 z-0" />

          {mockArguments.map((arg, idx) => (
            <div
              key={arg.id}
              className={`p-8 md:p-12 lg:p-16 space-y-8 relative z-10 ${
                idx === 0
                  ? "border-b md:border-b-0 md:border-r border-outline-variant/10"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3 font-label text-[10px] tracking-widest text-zinc-500 uppercase">
                <span
                  className={`w-2 h-2 rounded-full ${
                    idx === 0 ? "bg-primary" : "bg-secondary"
                  }`}
                />
                <span>Argument: {arg.argumentType}</span>
              </div>
              <div className="space-y-6">
                {arg.content.map((paragraph, pIdx) => (
                  <p
                    key={pIdx}
                    className={`text-xl md:text-2xl font-light leading-relaxed ${
                      pIdx === 0 ? "text-on-surface/90" : "text-on-surface/70"
                    }`}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="pt-8 border-t border-outline-variant/10">
                <div className="font-label text-[10px] text-zinc-600 uppercase mb-4">
                  Referenced Logic
                </div>
                <div className="flex flex-wrap gap-2">
                  {arg.references.map((ref, rIdx) => (
                    <span
                      key={rIdx}
                      className={`px-2 py-1 bg-surface-container text-[10px] font-label border uppercase ${
                        rIdx === 0
                          ? idx === 0
                            ? "text-primary border-primary/20"
                            : "text-secondary border-secondary/20"
                          : "text-zinc-400 border-outline-variant"
                      }`}
                    >
                      {ref}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="px-6 md:px-16 mt-12 mb-20">
          <div className="bg-surface-container border border-outline-variant/20 p-8 rounded-sm relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-label text-[10px] font-bold text-primary tracking-[0.3em] uppercase">
                  <span className="material-symbols-outlined text-sm">hub</span>
                  POINT OF CONSENSUS
                </div>
                <h3 className="font-headline text-2xl font-bold tracking-tight">
                  The Primacy of Stability
                </h3>
                <p className="text-on-surface-variant max-w-2xl leading-relaxed">
                  Despite diverging on the <span className="italic text-on-surface">moral source</span> of
                  authority, both thinkers agree that the fundamental failure of
                  any political system is <strong className="text-primary">anarchy</strong>.
                  Both prioritize the preservation of the political body as the
                  prerequisite for any further human action.
                </p>
              </div>
              <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
                <div className="font-label text-[10px] text-zinc-500 uppercase">
                  Alignment Probability
                </div>
                <div className="text-4xl font-headline font-bold text-primary">
                  74.2%
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={() => setShowSynthesis(true)}
          className="bg-primary text-surface-container-lowest font-headline font-bold px-8 py-4 rounded-sm flex items-center gap-3 active:scale-95 transition-all hover:shadow-[0_0_45px_rgba(0,255,163,0.5)] border border-primary uppercase tracking-widest text-sm"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            bolt
          </span>
          Generate Synthesis
        </button>
      </div>

      <nav className="fixed bottom-0 left-0 w-full h-20 bg-surface/80 backdrop-blur-xl border-t border-outline-variant flex justify-around items-center px-4 pb-4 z-50">
        <Link
          href="/"
          className="flex flex-col items-center justify-center text-primary drop-shadow-[0_0_8px_rgba(0,255,163,0.3)] active:scale-90 transition-all"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            grid_view
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest mt-1">
            Hub
          </span>
        </Link>
        <Link
          href="/archive"
          className="flex flex-col items-center justify-center text-zinc-500 hover:text-zinc-200 active:scale-90 transition-all"
        >
          <span className="material-symbols-outlined">history_edu</span>
          <span className="font-mono text-[10px] uppercase tracking-widest mt-1">
            Archive
          </span>
        </Link>
        <Link
          href="/settings"
          className="flex flex-col items-center justify-center text-zinc-500 hover:text-zinc-200 active:scale-90 transition-all"
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="font-mono text-[10px] uppercase tracking-widest mt-1">
            Settings
          </span>
        </Link>
      </nav>
    </>
  );
}
