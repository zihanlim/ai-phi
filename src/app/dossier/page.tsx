"use client";

import { PhilosopherCard } from "@/components/PhilosopherCard";
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
    bio: "Greek philosopher who founded the Socratic method of inquiry. He believed in pursuing truth through systematic questioning and viewed philosophy as a preparation for death.",
    works: ["Apology", "Republic", "Phaedo", "Symposium"],
    ideas: ["The examined life", "Socratic method", "Virtue is knowledge", "Irony", "Dialectic"],
  },
  {
    id: "2",
    name: "Confucius",
    era: "551-479 BCE",
    tradition: "Eastern",
    bio: "Chinese philosopher whose teachings emphasized personal morality, social harmony, and justice. His ideas formed the basis of East Asian culture and society.",
    works: ["Analects", "The Five Classics", "The Book of Changes"],
    ideas: ["Ren (benevolence)", "Li (ritual)", "Social harmony", "Filial piety", "Rectification"],
  },
  {
    id: "3",
    name: "Lao Tzu",
    era: "6th century BCE",
    tradition: "Eastern",
    bio: "Founder of Taoism, credited with writing the Tao Te Ching. He advocated for living in harmony with the Tao (the Way) through Wu Wei (non-action).",
    works: ["Tao Te Ching", "Zhuangzi"],
    ideas: ["Wu wei (non-action)", "Tao (the Way)", "Naturalness", "Simplicity", "Te (virtue)"],
  },
  {
    id: "4",
    name: "Nietzsche",
    era: "1844-1900",
    tradition: "Western",
    bio: "German philosopher known for his critique of traditional European morality and religion. He proclaimed the death of God and introduced concepts like the Übermensch.",
    works: ["Thus Spoke Zarathustra", "Beyond Good and Evil", "The Birth of Tragedy", "On the Genealogy of Morals"],
    ideas: ["Übermensch", "Will to power", "Eternal recurrence", "Master-slave morality", "Nihilism"],
  },
  {
    id: "5",
    name: "Simone de Beauvoir",
    era: "1908-1986",
    tradition: "Western",
    bio: "French existentialist philosopher who wrote extensively on gender and identity. Her work 'The Second Sex' became foundational for feminist theory.",
    works: ["The Second Sex", "She Came to Stay", "The Ethics of Ambiguity"],
    ideas: ["Existentialist feminism", "The Other", "Gender performativity", "Freedom", "Ambiguity"],
  },
  {
    id: "6",
    name: "Frantz Fanon",
    era: "1925-1961",
    tradition: "African",
    bio: "Martinican-French psychiatrist and philosopher who wrote about colonialism, violence, and decolonization. His work influenced liberation movements worldwide.",
    works: ["The Wretched of the Earth", "Black Skin, White Masks", "A Dying Colonialism"],
    ideas: ["Colonial violence", "Decolonization", "Psychic alienation", "National consciousness", "Revolution"],
  },
  {
    id: "7",
    name: "Wang Yangming",
    era: "1472-1529",
    tradition: "Eastern",
    bio: "Chinese philosopher who developed the school of Neo-Confucianism known as the School of the Mind. He emphasized innate moral consciousness.",
    works: ["Instructions for Practical Living", "Chuan Xi Lu"],
    ideas: ["Xin (mind)", "Zhi xing he yi", " innate moral knowledge", "Unity of knowledge and action", "Pure knowing"],
  },
  {
    id: "8",
    name: "Aristotle",
    era: "384-322 BCE",
    tradition: "Western",
    bio: "Greek philosopher who wrote on physics, biology, ethics, politics, and logic. He systematized knowledge and emphasized empirical observation.",
    works: ["Nicomachean Ethics", "Politics", "Metaphysics", "Poetics"],
    ideas: ["Golden mean", "Teleology", "Virtue ethics", "Logic", "Four causes"],
  },
];

const traditions = ["All", "Western", "Eastern", "African", "Middle Eastern", "Latin American"];

export default function DossierPage() {
  return (
    <main className="min-h-screen p-4 md:p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-display text-primary mb-2">Philosopher Dossiers</h1>
        <p className="text-on-surface-variant">
          Explore biographies, major works, and key ideas from diverse philosophical traditions
        </p>
      </header>

      <div className="flex flex-wrap gap-2 mb-6">
        {traditions.map((tradition) => (
          <button
            key={tradition}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              tradition === "All"
                ? "bg-primary text-on-primary"
                : "bg-surface-variant text-on-surface-variant hover:bg-surface-container-highest"
            }`}
          >
            {tradition}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockPhilosophers.map((philosopher) => (
          <Link key={philosopher.id} href={`/dossier/${philosopher.id}`}>
            <PhilosopherCard philosopher={philosopher} />
          </Link>
        ))}
      </div>
    </main>
  );
}
