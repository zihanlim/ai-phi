
import Link from "next/link";
import { prisma } from "@/lib/db";

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

async function getPhilosophers(): Promise<Philosopher[]> {
  try {
    return await prisma.philosopher.findMany({
      orderBy: { name: "asc" },
      take: 8,
    });
  } catch {
    return [];
  }
}

export default async function HubPage() {
  const philosophers = await getPhilosophers();

  return (
    <>
      <main className="pt-16 pb-24 min-h-screen">
      {/* Roster Section */}
      <section className="mb-10">
        <div className="px-6 flex justify-between items-end mb-4">
          <h2 className="font-headline text-3xl tracking-tighter uppercase">
            Roster
          </h2>
          <Link
            href="/dossier"
            className="font-label text-[10px] text-secondary uppercase tracking-[0.2em] hover:text-secondary/80 transition-colors"
          >
            View All →
          </Link>
        </div>

        {philosophers.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-on-surface-variant text-sm">
              No philosophers available. Please ensure the database is seeded and the API is running.
            </p>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto px-6 hide-scrollbar snap-x snap-mandatory">
            {philosophers.slice(0, 8).map((philosopher) => (
              <Link
                key={philosopher.id}
                href={`/dossier/${philosopher.id}`}
                className="flex-shrink-0 w-[140px] h-[180px] bg-surface-container-high border border-outline-variant/20 relative group cursor-pointer overflow-hidden rounded-sm hover:border-primary/40 transition-colors snap-start"
              >
                {philosopher.imageUrl ? (
                  <img
                    src={philosopher.imageUrl}
                    alt={philosopher.name}
                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full bg-surface-container flex items-center justify-center">
                    <span className="font-headline text-4xl text-zinc-600">
                      {philosopher.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-2 left-3">
                  <p className="font-headline text-sm tracking-tight">{philosopher.name}</p>
                  <p className="font-label text-[9px] text-zinc-500">{philosopher.era}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Threads / Actions Section */}
      <section className="px-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="font-headline text-3xl tracking-tighter uppercase">Arena</h2>
          <div className="h-[1px] flex-grow mx-4 bg-[#27272a]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Initiate Debate Card */}
          <Link
            href="/debate"
            className="bg-surface-container-lowest border-2 border-dashed border-outline-variant/30 py-8 flex flex-col items-center justify-center group hover:border-primary transition-colors rounded-sm"
          >
            <div className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-all">
              <span className="material-symbols-outlined text-primary">groups</span>
            </div>
            <span className="font-headline text-lg tracking-tight uppercase group-hover:text-primary transition-colors">
              Debate Chamber
            </span>
            <span className="font-label text-[10px] text-zinc-500 mt-1 uppercase tracking-widest">
              Compare multiple thinkers
            </span>
          </Link>

          {/* One-on-One Dialogue Card */}
          <Link
            href="/dialogue"
            className="bg-surface-container-lowest border-2 border-dashed border-outline-variant/30 py-8 flex flex-col items-center justify-center group hover:border-secondary transition-colors rounded-sm"
          >
            <div className="w-12 h-12 rounded-full border border-secondary/30 flex items-center justify-center mb-3 group-hover:bg-secondary/10 transition-all">
              <span className="material-symbols-outlined text-secondary">chat</span>
            </div>
            <span className="font-headline text-lg tracking-tight uppercase group-hover:text-secondary transition-colors">
              Dialogue
            </span>
            <span className="font-label text-[10px] text-zinc-500 mt-1 uppercase tracking-widest">
              Deep dive with one thinker
            </span>
          </Link>
        </div>

        {/* Quick Access - Recent Conversations */}
        <div className="flex justify-between items-center mt-4">
          <h2 className="font-headline text-2xl tracking-tighter uppercase">Archive</h2>
          <Link
            href="/archive"
            className="font-label text-[10px] text-zinc-500 uppercase tracking-widest hover:text-primary transition-colors"
          >
            View All →
          </Link>
        </div>
        <div className="bg-surface-container border border-outline-variant/10 rounded-sm overflow-hidden">
          <div className="p-8 text-center">
            <span className="material-symbols-outlined text-4xl text-zinc-600 mb-3 block">
              history_edu
            </span>
            <p className="text-on-surface-variant text-sm">
              Your saved conversations will appear here.
            </p>
            <Link
              href="/archive"
              className="inline-block mt-4 text-primary font-label text-[10px] uppercase tracking-widest hover:underline"
            >
              Go to Archive →
            </Link>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}
