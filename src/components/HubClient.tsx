"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Philosopher {
  id: string;
  name: string;
  era: string;
  tradition: string;
  bio: string;
  works: string[];
  ideas: string[];
  imageUrl?: string | null;
}

interface DragHubClientProps {
  philosophers: Philosopher[];
}

// Filter categories
const categories = [
  { id: "all", label: "All" },
  { id: "philosophers", label: "Philosophers" },
  { id: "macro", label: "Macro" },
  { id: "risk", label: "Risk" },
  { id: "value", label: "Value" },
  { id: "quant", label: "Quant" },
  { id: "behavioral", label: "Behavioral" },
];

// Category philosopher IDs
const categoryPhilosophers: Record<string, string[]> = {
  philosophers: ["socrates", "plato", "aristotle", "confucius", "lao-tzu", "nietzsche", "simone-de-beauvoir", "frantz-fanon", "wang-yangming"],
  macro: ["ray-dalio", "stanley-druckenmiller", "jeff-gundlach"],
  risk: ["nassim-taleb", "howard-marks"],
  value: ["warren-buffett", "seth-klarman"],
  quant: ["jim-simons", "david-shaw"],
  behavioral: ["morgan-housel"],
};

export function DragHubClient({ philosophers }: DragHubClientProps) {
  const router = useRouter();
  const [droppedPhilosophers, setDroppedPhilosophers] = useState<Philosopher[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleDragStart = useCallback((e: React.DragEvent, philosopher: Philosopher) => {
    e.dataTransfer.setData("application/json", JSON.stringify(philosopher));
    e.dataTransfer.effectAllowed = "copy";
    
    const dragImage = document.createElement("div");
    dragImage.className = "w-24 h-32 bg-surface border-2 border-primary rounded-sm overflow-hidden flex flex-col shadow-xl relative";
    
    if (philosopher.imageUrl) {
      dragImage.innerHTML = `
        <img src="${philosopher.imageUrl}" class="w-full h-full object-cover object-top" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <p class="absolute bottom-0 w-full px-2 pb-1 font-label text-[10px] text-white text-center">${philosopher.name.split(" ")[0]}</p>
      `;
    } else {
      dragImage.innerHTML = `
        <div class="w-full h-20 bg-surface-container flex items-center justify-center">
          <span class="font-headline text-3xl text-zinc-600">${philosopher.name.charAt(0)}</span>
        </div>
        <p class="p-2 font-label text-[10px] text-white text-center">${philosopher.name.split(" ")[0]}</p>
      `;
    }
    
    dragImage.style.position = "absolute";
    dragImage.style.top = "-1000px";
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 48, 64);
    
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    try {
      const data = e.dataTransfer.getData("application/json");
      const philosopher = JSON.parse(data) as Philosopher;
      
      setDroppedPhilosophers((prev) => {
        const exists = prev.some((p) => p.id === philosopher.id);
        if (exists) return prev;
        return [...prev, philosopher];
      });
    } catch (err) {
      console.error("Failed to parse dropped philosopher:", err);
    }
  }, []);

  const handleDropZoneClick = useCallback(() => {
    if (droppedPhilosophers.length > 0) {
      const ids = droppedPhilosophers.map((p) => p.id).join(",");
      if (droppedPhilosophers.length === 1) {
        router.push(`/dialogue?philosopher=${droppedPhilosophers[0].id}`);
      } else {
        router.push(`/debate?philosophers=${ids}`);
      }
    }
  }, [droppedPhilosophers, router]);

  const clearDropped = useCallback(() => {
    setDroppedPhilosophers([]);
  }, []);

  const removeDropped = useCallback((id: string) => {
    setDroppedPhilosophers((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return (
    <>
      {/* Thinkers Grid */}
      <section className="mb-6">
        {/* Search Bar Banner */}
        <div className="px-6 mb-6 pt-8">
          <div className="bg-gradient-to-r from-[#00aa66]/15 to-[#4477cc]/15 border border-outline-variant/20 rounded-2xl p-6 overflow-hidden relative">
            {/* Background Image */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 max-w-[500px] hidden md:block">
              <img 
                src="/banner/banner.png" 
                alt="" 
                className="w-full h-full object-cover object-right"
              />
            </div>
            {/* Banner Header */}
            <div className="mb-4 relative z-10">
              <h3 className="font-headline text-[31px] leading-tight text-on-surface" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontWeight: 700 }}>
                Chat with Thinkers, Anytime, Anywhere.
              </h3>
              <p className="text-sm text-on-surface-variant mt-1">
                Your Proactive Intellectual Companion Awaits.
              </p>
            </div>
            {/* Search Input */}
            <div className="relative z-10">
              <div className="bg-surface rounded-full px-4 py-3 flex items-center gap-3 w-[325px] relative">
                <span className="material-symbols-outlined text-zinc-500 text-xl shrink-0">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search thinkers..."
                  className="w-full bg-transparent text-sm text-on-surface placeholder:text-zinc-500 focus:outline-none"
                />
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                ) : (
                  <img 
                    src="https://cdn.talkie-ai.com/public-cdn-s3-us-west-2/talkie-op-img/image/1125577335_1725335062419_send.png" 
                    alt="Search" 
                    className="w-5 h-5 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 flex justify-between items-end mb-4">
          <h2 className="font-headline text-3xl tracking-tighter uppercase">
            Thinkers
          </h2>
          <Link
            href="/dossier"
            className="font-label text-[10px] text-secondary uppercase tracking-[0.2em] hover:text-secondary/80 transition-colors"
          >
            View All
          </Link>
        </div>

        {/* Category Filters */}
        <div className="px-6 mb-4">
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-sm font-label text-[10px] uppercase tracking-widest transition-all ${
                  activeCategory === cat.id
                    ? "bg-primary text-surface-container-lowest"
                    : "bg-surface-container text-zinc-400 hover:text-zinc-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-3 px-6">
          {philosophers
            .filter((p) => {
              if (activeCategory !== "all") {
                const catIds = categoryPhilosophers[activeCategory];
                if (!catIds?.includes(p.id)) return false;
              }
              if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                  p.name.toLowerCase().includes(query) ||
                  p.era.toLowerCase().includes(query) ||
                  p.tradition.toLowerCase().includes(query) ||
                  p.ideas.some(idea => idea.toLowerCase().includes(query))
                );
              }
              return true;
            })
            .map((philosopher) => (
              <div
                key={philosopher.id}
                draggable
                onDragStart={(e) => handleDragStart(e, philosopher)}
                className="group"
              >
                <Link
                  href={`/dossier/${philosopher.id}`}
                  className="block h-64 bg-surface border border-outline-variant/20 relative cursor-grab active:cursor-grabbing overflow-hidden rounded-sm hover:border-primary/40 transition-colors"
                >
                  {philosopher.imageUrl ? (
                    <img
                      src={philosopher.imageUrl}
                      alt={philosopher.name}
                      className="absolute inset-0 w-full h-full object-cover grayscale opacity-60 transition-opacity duration-500 group-hover:opacity-0"
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full bg-surface-container flex items-center justify-center">
                      <span className="font-headline text-4xl text-zinc-600">
                        {philosopher.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  {(() => {
                    if (!philosopher.imageUrl) return null;
                    const match = philosopher.imageUrl.match(/^(.+\/)([^/]+)\.png$/);
                    if (match) {
                      const [, dir, name] = match;
                      return (
                        <img
                          src={`${dir}color/${name}_c.png`}
                          alt={philosopher.name}
                          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        />
                      );
                    }
                    return null;
                  })()}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-3">
                    <p className="font-headline text-sm tracking-tight">
                      {philosopher.name}
                    </p>
                    <p className="font-label text-[9px] text-zinc-500">
                      {philosopher.era}
                    </p>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-xs text-white/50">drag_indicator</span>
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </section>

      {/* Arena Drop Zone */}
      <section 
        className="px-6"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div 
          className={`
            relative border-2 border-dashed rounded-sm transition-all min-h-[320px]
            ${isDragOver 
              ? "border-primary bg-primary/5" 
              : droppedPhilosophers.length > 0 
                ? "border-primary/50 bg-surface-container" 
                : "border-outline-variant/30 bg-surface-container/50"
            }
          `}
        >
          {droppedPhilosophers.length === 0 && (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-5xl text-zinc-600 mb-3 block">
                drag_indicator
              </span>
              <p className="font-headline text-lg text-zinc-400 mb-1">
                Drag thinkers here
              </p>
              <p className="font-label text-[10px] text-zinc-600 uppercase tracking-widest">
                to start a discussion
              </p>
            </div>
          )}

          <div className="p-4">
            {droppedPhilosophers.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-label text-[10px] text-primary uppercase tracking-widest">
                    {droppedPhilosophers.length === 1 ? "1 Thinker Selected" : `${droppedPhilosophers.length} Thinkers Selected`}
                  </p>
                  <button
                    onClick={clearDropped}
                    className="font-label text-[10px] text-zinc-500 uppercase tracking-widest hover:text-zinc-300"
                  >
                    Clear
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-6 justify-center">
                  {droppedPhilosophers.map((p) => (
                    <div
                      key={p.id}
                      className="relative bg-surface border border-primary/30 rounded-sm overflow-hidden group flex-shrink-0"
                    >
                      <div className="w-56 h-72 relative">
                        {p.imageUrl ? (
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-full h-full object-cover object-top"
                          />
                        ) : (
                          <div className="w-full h-full bg-surface-container flex items-center justify-center">
                            <span className="font-headline text-4xl text-zinc-600">
                              {p.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="font-headline text-base text-white text-center">
                            {p.name}
                          </p>
                          <p className="font-label text-[9px] text-zinc-400 text-center">
                            {p.era}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            removeDropped(p.id);
                          }}
                          className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <span className="material-symbols-outlined text-xs text-white">close</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    onClick={handleDropZoneClick}
                    className={`
                      px-8 py-4 rounded-sm font-headline font-bold text-lg uppercase tracking-[0.2em] transition-all active:scale-95
                      ${droppedPhilosophers.length === 1
                        ? "bg-primary text-surface-container-lowest hover:shadow-[0_0_30px_rgba(0,255,163,0.4)]"
                        : "bg-secondary text-surface-container-lowest hover:shadow-[0_0_30px_rgba(105,156,255,0.4)]"
                      }
                    `}
                  >
                    {droppedPhilosophers.length === 1 ? "Start Dialogue" : "Start Debate"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
