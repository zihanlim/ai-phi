"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ComparisonView } from "@/components/ComparisonView";
import { Navigation } from "@/components/Navigation";

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
  round?: number;
}

function DebateContent() {
  const searchParams = useSearchParams();
  const [philosophers, setPhilosophers] = useState<Philosopher[]>([]);
  const [selectedPhilosophers, setSelectedPhilosophers] = useState<string[]>([]);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ComparisonMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [loadingPhilosophers, setLoadingPhilosophers] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Handle pre-selected philosopher from query param
  useEffect(() => {
    const philosopherId = searchParams.get("philosopher");
    if (philosopherId) {
      setSelectedPhilosophers([philosopherId]);
    }
  }, [searchParams]);

  // Fetch philosophers
  useEffect(() => {
    async function fetchPhilosophers() {
      try {
        const res = await fetch("/api/philosophers");
        if (res.ok) {
          const data = await res.json();
          setPhilosophers(data);
        }
      } catch {
        console.error("Failed to fetch philosophers");
      } finally {
        setLoadingPhilosophers(false);
      }
    }
    fetchPhilosophers();
  }, []);

  const togglePhilosopher = (id: string) => {
    setSelectedPhilosophers((prev) => {
      if (prev.includes(id)) {
        return prev.filter((p) => p !== id);
      }
      return [...prev, id];
    });
    setShowResults(false);
    setMessages([]);
    setConversationId(null);
    setCurrentRound(0);
  };

  const handleSubmitQuestion = async () => {
    if (!question.trim() || selectedPhilosophers.length < 1) return;

    setIsLoading(true);
    setShowResults(true);
    const round = currentRound;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId,
          philosopherIds: selectedPhilosophers,
          message: question,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Store conversation ID for follow-up questions
        if (data.conversationId) {
          setConversationId(data.conversationId);
        }
        // Transform API response to ComparisonMessage format with round
        const newMessages: ComparisonMessage[] = data.results.map(
          (response: { philosopherId: string; philosopherName: string; response: string }, idx: number) => ({
            id: `msg-${Date.now()}-${idx}`,
            philosopherId: response.philosopherId,
            philosopherName: response.philosopherName,
            content: response.response,
            round,
          })
        );
        // Append new messages to existing ones
        setMessages((prev) => [...prev, ...newMessages]);
        setCurrentRound(round + 1);
      } else {
        // Fallback error message
        const errorMessages: ComparisonMessage[] = selectedPhilosophers.map((id, idx) => {
          const philosopher = philosophers.find((p) => p.id === id);
          return {
            id: `error-${Date.now()}-${idx}`,
            philosopherId: id,
            philosopherName: philosopher?.name || "Unknown",
            content: "Unable to retrieve response. Please try again.",
            round,
          };
        });
        setMessages((prev) => [...prev, ...errorMessages]);
      }
    } catch (error) {
      console.error("Failed to submit question:", error);
      const errorMessages: ComparisonMessage[] = selectedPhilosophers.map((id, idx) => {
        const philosopher = philosophers.find((p) => p.id === id);
        return {
          id: `error-${Date.now()}-${idx}`,
          philosopherId: id,
          philosopherName: philosopher?.name || "Unknown",
          content: "Network error. Please check your connection and try again.",
          round,
        };
      });
      setMessages((prev) => [...prev, ...errorMessages]);
    } finally {
      setIsLoading(false);
      setQuestion("");
    }
  };

  const selectedPhilosopherData = philosophers.filter((p) =>
    selectedPhilosophers.includes(p.id)
  );

  // Build image map for ComparisonView
  const philosopherImages: Record<string, string> = {};
  selectedPhilosopherData.forEach((p) => {
    if (p.imageUrl) philosopherImages[p.id] = p.imageUrl;
  });

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-[#09090b] border-b border-[#27272a] flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-primary active:scale-95 transition-transform">
            <span className="material-symbols-outlined">menu</span>
          </Link>
          <h1 className="font-headline font-bold tracking-tighter uppercase text-2xl tracking-widest text-primary">
            DIGITAL AGORA
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-label text-[10px] text-zinc-500 uppercase tracking-[0.2em] hidden md:block">
            Debate Chamber
          </span>
          <button className="text-primary active:scale-95 transition-transform">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </header>

      <main className="pt-16 pb-32 min-h-screen flex flex-col">
        {/* Philosopher Selection Section */}
        <section className="p-6 border-b border-outline-variant/20">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary">groups</span>
            <h2 className="font-headline text-lg uppercase tracking-widest">
              Select Philosophers (2+ recommended)
            </h2>
          </div>

          {loadingPhilosophers ? (
            <div className="flex gap-1 items-center">
              <span className="font-label text-primary text-xl blinking-cursor">_</span>
              <span className="font-label text-primary text-xl opacity-40">_</span>
              <span className="font-label text-primary text-xl opacity-20">_</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {philosophers.map((philosopher) => {
                const isSelected = selectedPhilosophers.includes(philosopher.id);
                return (
                  <button
                    key={philosopher.id}
                    onClick={() => togglePhilosopher(philosopher.id)}
                    className={`rounded-sm overflow-hidden group cursor-pointer transition-all border-2 ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-outline-variant/30 hover:border-primary/30"
                    }`}
                  >
                    <div className="h-48 relative">
                      {philosopher.imageUrl ? (
                        <img src={philosopher.imageUrl} alt={philosopher.name}
                          className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 transition-opacity" />
                      ) : (
                        <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                          <span className="font-headline text-3xl text-zinc-600">{philosopher.name.charAt(0)}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                    <div className="p-2 text-center">
                      <p className={`font-label text-[9px] uppercase tracking-widest truncate ${isSelected ? "text-primary" : "text-zinc-400"}`}>
                        {philosopher.name}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {selectedPhilosophers.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="font-label text-[10px] text-zinc-500 uppercase">
                Selected: {selectedPhilosophers.length}
              </span>
              {selectedPhilosopherData.map((p) => (
                <span
                  key={p.id}
                  className="px-2 py-1 bg-surface-container-high text-primary text-[10px] font-label border border-primary/20"
                >
                  {p.name}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Question Input Section - stays visible for follow-up questions */}
        <section className="p-6 border-t border-outline-variant/20">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-secondary">help</span>
            <h2 className="font-headline text-lg uppercase tracking-widest">
              {showResults ? "Ask Follow-up" : "Pose Your Question"}
            </h2>
          </div>

          <div className="relative">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={showResults ? "Continue the debate with a follow-up question..." : "What philosophical question would you like to pose to these thinkers?"}
              rows={3}
              className="w-full bg-surface-container border border-outline-variant/30 rounded-sm p-4 text-on-surface placeholder:text-zinc-600 focus:outline-none focus:border-primary transition-colors resize-none font-body"
            />
            <div className="flex justify-between items-center mt-4">
              <span className="font-label text-[10px] text-zinc-500">
                Press Enter to submit · Shift+Enter for new line
              </span>
              <button
                onClick={handleSubmitQuestion}
                disabled={
                  !question.trim() || selectedPhilosophers.length === 0 || isLoading
                }
                className={`px-6 py-3 rounded-sm font-headline font-bold uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 ${
                  question.trim() && selectedPhilosophers.length > 0 && !isLoading
                    ? "bg-primary text-surface-container-lowest hover:shadow-[0_0_20px_rgba(0,255,163,0.4)]"
                    : "bg-surface-container text-zinc-600 cursor-not-allowed"
                }`}
              >
                <span className="material-symbols-outlined">send</span>
                {showResults ? "Continue Debate" : "Pose Question"}
              </button>
            </div>
          </div>
        </section>

        {/* Loading State */}
        {isLoading && (
          <section className="p-6">
            <div className="bg-surface-container border border-outline-variant/20 rounded-sm p-8 text-center">
              <div className="flex gap-1 items-center justify-center mb-4">
                <span className="font-label text-primary text-2xl blinking-cursor">_</span>
                <span className="font-label text-primary text-2xl opacity-40">_</span>
                <span className="font-label text-primary text-2xl opacity-20">_</span>
              </div>
              <p className="font-headline text-lg uppercase tracking-widest text-zinc-400">
                Philosophers Are Deliberating...
              </p>
              <p className="font-label text-[10px] text-zinc-600 mt-2 uppercase">
                Retrieving wisdom from diverse traditions
              </p>
            </div>
          </section>
        )}

        {/* Results Section */}
        {showResults && messages.length > 0 && (
          <section className="p-6 border-t border-outline-variant/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">compare</span>
                <h2 className="font-headline text-lg uppercase tracking-widest">
                  Comparative Responses
                </h2>
              </div>
              <button
                onClick={() => {
                  setMessages([]);
                  setConversationId(null);
                  setShowResults(false);
                }}
                className="px-4 py-2 rounded-sm font-label text-[10px] uppercase tracking-widest bg-surface-container border border-outline-variant/30 hover:border-primary/50 text-zinc-400 hover:text-primary transition-all"
              >
                New Debate
              </button>
            </div>
            <div className="bg-surface-container border border-outline-variant/10 rounded-sm overflow-hidden max-h-[400px]">
              <ComparisonView messages={messages} question={question || "Continuing conversation..."} philosopherImages={philosopherImages} />
            </div>
          </section>
        )}

        {/* Empty State - When no question has been posed yet */}
        {!showResults && !isLoading && (
          <section className="flex-1 p-6 flex items-center justify-center">
            <div className="text-center">
              <span className="material-symbols-outlined text-6xl text-zinc-600 mb-4 block">
                psychology
              </span>
              <h3 className="font-headline text-xl text-zinc-400 mb-2">
                The Arena Awaits
              </h3>
              <p className="text-on-surface-variant text-sm max-w-md">
                Select at least one philosopher and pose a question to see their
                perspectives compared side by side.
              </p>
            </div>
          </section>
        )}
      </main>

      <Navigation />
    </>
  );
}

export default function DebatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface flex items-center justify-center">
          <div className="flex gap-1 items-center">
            <span className="font-label text-primary text-xl blinking-cursor">_</span>
            <span className="font-label text-primary text-xl opacity-40">_</span>
            <span className="font-label text-primary text-xl opacity-20">_</span>
          </div>
        </div>
      }
    >
      <DebateContent />
    </Suspense>
  );
}
