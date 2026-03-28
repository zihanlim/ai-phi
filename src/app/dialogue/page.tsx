"use client";

import { useState } from "react";
import { PhilosopherCard } from "@/components/PhilosopherCard";
import { ChatInterface } from "@/components/ChatInterface";

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

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  philosopherId?: string;
  philosopherName?: string;
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

export default function DialoguePage() {
  const [selectedPhilosopher, setSelectedPhilosopher] = useState<Philosopher | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    if (!selectedPhilosopher) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: `dialogue-${selectedPhilosopher.id}-${Date.now()}`,
          philosopherIds: [selectedPhilosopher.id],
          message: content,
        }),
      });

      const data = await response.json();

      if (data.results && data.results[0]) {
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.results[0].response,
          philosopherId: selectedPhilosopher.id,
          philosopherName: selectedPhilosopher.name,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "Failed to get response. Please try again.",
        philosopherId: selectedPhilosopher.id,
        philosopherName: selectedPhilosopher.name,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-4 md:p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-display text-primary mb-2">Dialogue Interface</h1>
        <p className="text-on-surface-variant">
          Select a philosopher for a one-on-one conversation
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        <section className="lg:col-span-1 overflow-y-auto">
          <h2 className="text-lg font-display text-on-surface mb-4">
            Choose Your Dialogue Partner
          </h2>
          <div className="space-y-3">
            {mockPhilosophers.map((philosopher) => (
              <PhilosopherCard
                key={philosopher.id}
                philosopher={philosopher}
                selected={selectedPhilosopher?.id === philosopher.id}
                onSelect={setSelectedPhilosopher}
              />
            ))}
          </div>
        </section>

        <section className="lg:col-span-2 bg-surface-variant rounded-2xl overflow-hidden flex flex-col">
          {selectedPhilosopher ? (
            <>
              <div className="p-4 border-b border-outline-variant flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="font-display text-primary text-xl">
                    {selectedPhilosopher.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h2 className="font-display text-on-surface">
                    {selectedPhilosopher.name}
                  </h2>
                  <p className="text-sm text-on-surface-variant">
                    {selectedPhilosopher.era} · {selectedPhilosopher.tradition}
                  </p>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <ChatInterface
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  disabled={isLoading}
                  philosopherName={selectedPhilosopher.name}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-on-surface-variant">
              <div className="text-center">
                <span className="material-symbols-outlined text-4xl mb-2 block">
                  person_search
                </span>
                <p>Select a philosopher to begin dialogue</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
