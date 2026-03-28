"use client";

import { useState } from "react";
import { PhilosopherCard } from "@/components/PhilosopherCard";
import { ComparisonView } from "@/components/ComparisonView";

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

interface ComparisonMessage {
  id: string;
  philosopherId: string;
  philosopherName: string;
  content: string;
}

const mockPhilosophers: Philosopher[] = [
  {
    id: "1",
    name: "Socrates",
    era: "470-399 BCE",
    tradition: "Western",
    bio: "Greek philosopher who founded the Socratic method of inquiry.",
    works: ["Apology", "Republic", "Phaedo"],
    ideas: ["The examined life", "Socratic method", "Virtue is knowledge"],
  },
  {
    id: "2",
    name: "Confucius",
    era: "551-479 BCE",
    tradition: "Eastern",
    bio: "Chinese philosopher whose teachings emphasized morality and social harmony.",
    works: ["Analects", "The Five Classics"],
    ideas: ["Ren (benevolence)", "Li (ritual)", "Social harmony"],
  },
  {
    id: "3",
    name: "Lao Tzu",
    era: "6th century BCE",
    tradition: "Eastern",
    bio: "Founder of Taoism, credited with writing the Tao Te Ching.",
    works: ["Tao Te Ching", "Zhuangzi"],
    ideas: ["Wu wei (non-action)", "Tao (the Way)", "Naturalness"],
  },
  {
    id: "4",
    name: "Nietzsche",
    era: "1844-1900",
    tradition: "Western",
    bio: "German philosopher known for his critique of traditional European morality and religion.",
    works: ["Thus Spoke Zarathustra", "Beyond Good and Evil", "The Birth of Tragedy"],
    ideas: ["Übermensch", "Will to power", "Eternal recurrence"],
  },
];

export default function DebatePage() {
  const [selectedPhilosophers, setSelectedPhilosophers] = useState<Philosopher[]>([]);
  const [question, setQuestion] = useState("");
  const [isDebating, setIsDebating] = useState(false);
  const [messages, setMessages] = useState<ComparisonMessage[]>([]);

  const togglePhilosopher = (philosopher: Philosopher) => {
    setSelectedPhilosophers((prev) => {
      const exists = prev.find((p) => p.id === philosopher.id);
      if (exists) {
        return prev.filter((p) => p.id !== philosopher.id);
      }
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, philosopher];
    });
  };

  const startDebate = async () => {
    if (!question.trim() || selectedPhilosophers.length === 0) return;

    setIsDebating(true);

    const newMessages: ComparisonMessage[] = selectedPhilosophers.map((p) => ({
      id: `temp-${p.id}`,
      philosopherId: p.id,
      philosopherName: p.name,
      content: "",
    }));

    setMessages(newMessages);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: "debate-" + Date.now(),
          philosopherIds: selectedPhilosophers.map((p) => p.id),
          message: question,
        }),
      });

      const data = await response.json();

      if (data.results) {
        setMessages((prev) =>
          prev.map((msg) => {
            const result = data.results.find(
              (r: { philosopherId: string; response: string }) =>
                r.philosopherId === msg.philosopherId
            );
            return result ? { ...msg, content: result.response } : msg;
          })
        );
      }
    } catch {
      setMessages((prev) =>
        prev.map((msg) => ({
          ...msg,
          content: "Failed to get response. Please try again.",
        }))
      );
    } finally {
      setIsDebating(false);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-display text-primary mb-2">Debate Chamber</h1>
        <p className="text-on-surface-variant">
          Select 2-4 philosophers and pose a question to see them debate
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        <section className="lg:col-span-1 overflow-y-auto">
          <h2 className="text-lg font-display text-on-surface mb-4">
            Select Philosophers ({selectedPhilosophers.length}/4)
          </h2>
          <div className="space-y-3">
            {mockPhilosophers.map((philosopher) => (
              <PhilosopherCard
                key={philosopher.id}
                philosopher={philosopher}
                selected={selectedPhilosophers.some((p) => p.id === philosopher.id)}
                onSelect={togglePhilosopher}
              />
            ))}
          </div>
        </section>

        <section className="lg:col-span-2 flex flex-col bg-surface-variant rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-outline-variant">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Pose a philosophical question..."
              className="w-full px-4 py-3 rounded-xl bg-surface text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={startDebate}
              disabled={!question.trim() || selectedPhilosophers.length < 2 || isDebating}
              className="mt-3 w-full px-6 py-3 rounded-xl bg-primary text-on-primary font-medium hover:bg-primary-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDebating ? "Starting Debate..." : "Start Debate"}
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            <ComparisonView messages={messages} question={question} />
          </div>
        </section>
      </div>
    </main>
  );
}
