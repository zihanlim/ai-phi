import { prisma } from "@/lib/db";
import { DragHubClient } from "@/components/HubClient";

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
    });
  } catch {
    return [];
  }
}

export default async function HubPage() {
  const philosophers = await getPhilosophers();

  return (
    <main className="pt-16 pb-24">
      <DragHubClient philosophers={philosophers} />
    </main>
  );
}
