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

interface DebateScenario {
  id: string;
  title: string;
  category: string;
  participants: string[];
  status: "ongoing" | "concluded";
  timeAgo: string;
  description: string;
  imageUrl: string;
}

async function getPhilosophers(): Promise<Philosopher[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/philosophers`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

const mockDebates: DebateScenario[] = [
  {
    id: "1",
    title: "Ethics of AI: Kant vs. Mill",
    category: "Ethics & Tech",
    participants: ["Kant", "Mill"],
    status: "ongoing",
    timeAgo: "12m ago",
    description:
      "Deontological constraints meet utilitarian maximization in the realm of autonomous systems. Who holds the moral compass?",
    imageUrl:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
  },
  {
    id: "2",
    title: "Modern Power: Machiavelli vs. Hobbes",
    category: "Political Theory",
    participants: ["Machiavelli", "Hobbes"],
    status: "concluded",
    timeAgo: "2h ago",
    description:
      "The Prince meets Leviathan. An examination of statecraft and the social contract in a post-globalization landscape.",
    imageUrl:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80",
  },
];

export default async function HubPage() {
  const philosophers = await getPhilosophers();

  return (
    <main className="pt-20 pb-24 min-h-screen">
      <section className="mb-10">
        <div className="px-6 flex justify-between items-end mb-4">
          <h2 className="font-headline text-3xl tracking-tighter uppercase">
            Roster
          </h2>
          <span className="font-label text-[10px] text-primary uppercase tracking-[0.2em]">
            Active Intellectuals
          </span>
        </div>
        <div className="flex gap-4 overflow-x-auto px-6 hide-scrollbar">
          {philosophers.slice(0, 6).map((philosopher) => (
            <div
              key={philosopher.id}
              className="flex-shrink-0 w-[140px] h-[180px] bg-surface-container-high border border-outline-variant/20 relative group cursor-pointer overflow-hidden rounded-sm"
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
                <p className="font-headline text-sm tracking-tight">
                  {philosopher.name}
                </p>
                <p className="font-label text-[9px] text-zinc-500">
                  {philosopher.era}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="font-headline text-3xl tracking-tighter uppercase">
            Threads
          </h2>
          <div className="h-[1px] flex-grow mx-4 bg-[#27272a]" />
        </div>

        <button className="w-full bg-surface-container-lowest border-2 border-dashed border-outline-variant/30 py-8 flex flex-col items-center justify-center group hover:border-primary transition-colors rounded-sm">
          <div className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-all">
            <span className="material-symbols-outlined text-primary">add</span>
          </div>
          <span className="font-headline text-lg tracking-tight uppercase group-hover:text-primary transition-colors">
            Initiate Custom Debate
          </span>
          <span className="font-label text-[10px] text-zinc-500 mt-1 uppercase tracking-widest">
            Select logic parameters
          </span>
        </button>

        {mockDebates.map((debate) => (
          <div
            key={debate.id}
            className="bg-surface-container border border-outline-variant/10 rounded-sm overflow-hidden group cursor-pointer"
          >
            <div className="h-48 relative">
              <img
                src={debate.imageUrl}
                alt={debate.title}
                className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent" />
              <div
                className={`absolute top-4 right-4 font-label text-[9px] px-2 py-1 font-bold tracking-widest uppercase ${
                  debate.status === "ongoing"
                    ? "bg-primary text-surface-container-lowest"
                    : "bg-zinc-800 text-zinc-400"
                }`}
              >
                {debate.status === "ongoing" ? "Ongoing" : "Concluded"}
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <span className="font-label text-[10px] text-secondary tracking-widest uppercase">
                  {debate.category}
                </span>
                <span className="font-label text-[10px] text-zinc-500">
                  {debate.timeAgo}
                </span>
              </div>
              <h3 className="font-headline text-xl mb-4 leading-none">
                {debate.title}
              </h3>
              <p className="text-on-surface-variant text-sm line-clamp-2 font-body mb-6">
                {debate.description}
              </p>
              <div className="flex justify-between items-center border-t border-outline-variant/10 pt-4">
                <div className="flex -space-x-2">
                  {debate.participants.map((p, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-surface-container bg-zinc-800 flex items-center justify-center text-[10px] font-headline"
                    >
                      {p.charAt(0)}
                    </div>
                  ))}
                </div>
                <button className="text-primary font-label text-[10px] uppercase tracking-widest flex items-center gap-2 hover:underline">
                  {debate.status === "ongoing" ? (
                    <>
                      Enter Arena{" "}
                      <span className="material-symbols-outlined text-xs">
                        arrow_forward
                      </span>
                    </>
                  ) : (
                    <>
                      Read Transcript{" "}
                      <span className="material-symbols-outlined text-xs">
                        history_edu
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
