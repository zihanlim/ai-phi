"use client";

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

const mockPhilosophers: Philosopher[] = [
  {
    id: "1",
    name: "Socrates",
    era: "470-399 BCE",
    tradition: "Western",
    bio: "Greek philosopher who founded the Socratic method of inquiry. He believed in pursuing truth through systematic questioning and viewed philosophy as a preparation for death. Socrates wrote nothing himself; our knowledge of his philosophy comes from his students Plato and Xenophon.",
    works: ["Apology", "Republic", "Phaedo", "Symposium", "Gorgias", "Meno"],
    ideas: ["The examined life", "Socratic method", "Virtue is knowledge", "Irony", "Dialectic", "Know thyself"],
  },
  {
    id: "2",
    name: "Confucius",
    era: "551-479 BCE",
    tradition: "Eastern",
    bio: "Chinese philosopher whose teachings emphasized personal morality, social harmony, and justice. His ideas formed the basis of East Asian culture and society for over two millennia. He believed that self-cultivation leads to virtuous governance.",
    works: ["Analects", "The Five Classics", "The Book of Changes", "The Great Learning"],
    ideas: ["Ren (benevolence)", "Li (ritual)", "Social harmony", "Filial piety", "Rectification", "Junzi (noble person)"],
  },
  {
    id: "3",
    name: "Lao Tzu",
    era: "6th century BCE",
    tradition: "Eastern",
    bio: "Founder of Taoism, credited with writing the Tao Te Ching. He advocated for living in harmony with the Tao (the Way) through Wu Wei (non-action). His philosophy emphasizes naturalness, simplicity, and spontaneity.",
    works: ["Tao Te Ching", "Zhuangzi (attributed)"],
    ideas: ["Wu wei (non-action)", "Tao (the Way)", "Naturalness", "Simplicity", "Te (virtue)", "Yielding"],
  },
  {
    id: "4",
    name: "Nietzsche",
    era: "1844-1900",
    tradition: "Western",
    bio: "German philosopher known for his critique of traditional European morality and religion. He proclaimed the death of God and introduced concepts like the Übermensch and the will to power, challenging conventional values.",
    works: ["Thus Spoke Zarathustra", "Beyond Good and Evil", "The Birth of Tragedy", "On the Genealogy of Morals", "The Antichrist"],
    ideas: ["Übermensch", "Will to power", "Eternal recurrence", "Master-slave morality", "Nihilism", "Amor fati"],
  },
  {
    id: "5",
    name: "Simone de Beauvoir",
    era: "1908-1986",
    tradition: "Western",
    bio: "French existentialist philosopher who wrote extensively on gender and identity. Her work 'The Second Sex' became foundational for feminist theory, arguing that 'one is not born a woman, but becomes one.'",
    works: ["The Second Sex", "She Came to Stay", "The Ethics of Ambiguity", "All Men Are Mortal"],
    ideas: ["Existentialist feminism", "The Other", "Gender performativity", "Freedom", "Ambiguity", "Engagement"],
  },
  {
    id: "6",
    name: "Frantz Fanon",
    era: "1925-1961",
    tradition: "African",
    bio: "Martinican-French psychiatrist and philosopher who wrote about colonialism, violence, and decolonization. His work influenced liberation movements in Africa, Asia, and the Americas.",
    works: ["The Wretched of the Earth", "Black Skin, White Masks", "A Dying Colonialism", "Toward the Astrocyte"],
    ideas: ["Colonial violence", "Decolonization", "Psychic alienation", "National consciousness", "Revolution", "The lumpenproletariat"],
  },
  {
    id: "7",
    name: "Wang Yangming",
    era: "1472-1529",
    tradition: "Eastern",
    bio: "Chinese philosopher who developed the school of Neo-Confucianism known as the School of the Mind. He emphasized innate moral consciousness and the unity of knowledge and action.",
    works: ["Instructions for Practical Living", "Chuan Xi Lu", "Record of Great Learning"],
    ideas: ["Xin (mind)", "Zhi xing he yi", "innate moral knowledge", "Unity of knowledge and action", "Pure knowing", "Li (principle)"],
  },
  {
    id: "8",
    name: "Aristotle",
    era: "384-322 BCE",
    tradition: "Western",
    bio: "Greek philosopher who wrote on physics, biology, ethics, politics, and logic. He systematized knowledge and emphasized empirical observation, founding the Lyceum in Athens.",
    works: ["Nicomachean Ethics", "Politics", "Metaphysics", "Poetics", "Physics", "Organon"],
    ideas: ["Golden mean", "Teleology", "Virtue ethics", "Logic", "Four causes", "Hylomorphism"],
  },
];

export default function PhilosopherDossierPage() {
  const params = useParams();
  const philosopher = mockPhilosophers.find((p) => p.id === params.id);

  if (!philosopher) {
    return (
      <main className="min-h-screen p-4 md:p-6">
        <header className="mb-6">
          <Link href="/dossier" className="text-primary hover:underline mb-4 inline-block">
            ← Back to Dossiers
          </Link>
          <h1 className="text-3xl font-display text-primary">Philosopher not found</h1>
        </header>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-6">
      <Link href="/dossier" className="text-primary hover:underline mb-4 inline-block">
        ← Back to Dossiers
      </Link>

      <article className="max-w-3xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="font-display text-primary text-3xl">
                {philosopher.name.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-4xl font-display text-primary mb-1">
                {philosopher.name}
              </h1>
              <p className="text-lg text-on-surface-variant">
                {philosopher.era} · {philosopher.tradition} Philosophy
              </p>
            </div>
          </div>
        </header>

        <section className="mb-8">
          <h2 className="text-xl font-display text-on-surface mb-3">Biography</h2>
          <p className="text-on-surface-variant leading-relaxed">{philosopher.bio}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-display text-on-surface mb-3">Major Works</h2>
          <ul className="space-y-2">
            {philosopher.works.map((work, i) => (
              <li key={i} className="flex items-center gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-xl">
                  menu_book
                </span>
                {work}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-display text-on-surface mb-3">Key Ideas</h2>
          <div className="flex flex-wrap gap-2">
            {philosopher.ideas.map((idea, i) => (
              <span
                key={i}
                className="px-4 py-2 rounded-full bg-surface-variant text-on-surface-variant hover:bg-primary hover:text-on-primary transition-colors"
              >
                {idea}
              </span>
            ))}
          </div>
        </section>

        <section className="border-t border-outline-variant pt-6">
          <Link
            href={`/dialogue?philosopher=${philosopher.id}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-on-primary font-medium hover:bg-primary-dim transition-colors"
          >
            <span className="material-symbols-outlined">chat</span>
            Start a Dialogue
          </Link>
        </section>
      </article>
    </main>
  );
}
