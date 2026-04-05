"use client";

import { useState, useEffect, Suspense, useCallback, useRef, ChangeEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ComparisonView } from "@/components/ComparisonView";
import { LoadingDots } from "@/components/LoadingDots";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoGrow = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, []);

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
      const provider = localStorage.getItem("ai-phi-ai-provider") || "openai";
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId,
          philosopherIds: selectedPhilosophers,
          message: question,
          provider,
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

  // Reset debate handler
  const handleReset = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    setShowResults(false);
    setQuestion("");
  }, []);

  return (
    <>
      <main className="pt-16 pb-32 min-h-screen flex flex-col">
        {/* Philosopher Selection Section */}
        <section className="p-6 border-b border-outline-variant/20">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary" aria-hidden="true">groups</span>
            <h2 className="font-headline text-lg uppercase tracking-widest">
              Select Philosophers (2+ recommended)
            </h2>
          </div>

          {loadingPhilosophers ? (
            <div className="flex items-center justify-center py-8">
              <LoadingDots />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {philosophers.map((philosopher) => {
                const isSelected = selectedPhilosophers.includes(philosopher.id);
                return (
                  <button
                    key={philosopher.id}
                    onClick={() => togglePhilosopher(philosopher.id)}
                    className={`rounded-sm overflow-hidden group cursor-pointer transition-all border-2 focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-outline-variant/30 hover:border-primary/30"
                    }`}
                    aria-pressed={isSelected}
                    aria-label={`${philosopher.name}, ${philosopher.tradition}${isSelected ? ", selected" : ""}`}
                  >
                    <div className="h-48 relative">
                      {philosopher.imageUrl ? (
                        <img src={philosopher.imageUrl} alt={philosopher.name}
                          className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 transition-opacity" />
                      ) : (
                        <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                          <span className="font-headline text-3xl text-zinc-600" aria-hidden="true">{philosopher.name.charAt(0)}</span>
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
        <div className="fixed bottom-20 md:bottom-0 left-0 right-0 z-40 p-4 bg-surface border-t border-outline-variant/20">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-secondary">help</span>
              <h2 className="font-headline text-sm uppercase tracking-widest">
                {showResults ? "Ask Follow-up" : "Pose Your Question"}
              </h2>
            </div>
            <div className="flex gap-2">
              <textarea
                ref={textareaRef}
                value={question}
                onChange={(e) => {
                  setQuestion(e.target.value);
                  autoGrow(e);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    return;
                  }
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitQuestion();
                  }
                }}
                placeholder={showResults ? "Continue the debate..." : "What philosophical question would you like to pose?"}
                rows={1}
                className="flex-1 bg-surface-container border border-outline-variant/30 rounded-sm px-4 py-3 text-on-surface placeholder:text-zinc-600 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors resize-none font-body text-sm min-h-[48px] max-h-[200px] overflow-y-auto"
                aria-label="Debate question input"
              />
              <button
                onClick={handleSubmitQuestion}
                disabled={
                  !question.trim() || selectedPhilosophers.length === 0 || isLoading
                }
                className={`px-6 py-3 rounded-sm font-headline font-bold uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                  question.trim() && selectedPhilosophers.length > 0 && !isLoading
                    ? "bg-primary text-surface-container-lowest hover:shadow-[0_0_20px_rgba(0,255,163,0.4)]"
                    : "bg-surface-container text-zinc-600 cursor-not-allowed"
                }`}
                aria-label={showResults ? "Continue debate" : "Pose question"}
              >
                <span className="material-symbols-outlined" aria-hidden="true">send</span>
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <section className="p-6" aria-live="polite" aria-label="Loading">
            <div className="bg-surface-container border border-outline-variant/20 rounded-sm p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <LoadingDots size="lg" />
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
                onClick={handleReset}
                className="px-4 py-2 rounded-sm font-label text-[10px] uppercase tracking-widest bg-surface-container border border-outline-variant/30 hover:border-primary/50 text-zinc-400 hover:text-primary transition-all focus:outline-none focus:ring-2 focus:ring-primary/30"
                aria-label="Start a new debate"
              >
                New Debate
              </button>
            </div>
            <div className="w-full">
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
              <p className="text-on-surface-variant text-sm max-w-md mb-6">
                Select at least one philosopher and pose a question to see their
                perspectives compared side by side.
              </p>
              <div className="flex flex-col gap-2 items-center">
                <p className="font-label text-[10px] text-zinc-500 uppercase tracking-widest">Try asking</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => setQuestion("What is the meaning of life?")}
                    className="px-3 py-2 bg-surface-container border border-outline-variant/30 rounded-sm text-xs text-zinc-400 hover:text-primary hover:border-primary/30 transition-all"
                  >
                    What is the meaning of life?
                  </button>
                  <button
                    onClick={() => setQuestion("Can we achieve true freedom?")}
                    className="px-3 py-2 bg-surface-container border border-outline-variant/30 rounded-sm text-xs text-zinc-400 hover:text-primary hover:border-primary/30 transition-all"
                  >
                    Can we achieve true freedom?
                  </button>
                  <button
                    onClick={() => setQuestion("Is morality objective or relative?")}
                    className="px-3 py-2 bg-surface-container border border-outline-variant/30 rounded-sm text-xs text-zinc-400 hover:text-primary hover:border-primary/30 transition-all"
                  >
                    Is morality objective or relative?
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

    </>
  );
}

export default function DebatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface flex items-center justify-center">
          <LoadingDots />
        </div>
      }
    >
      <DebateContent />
    </Suspense>
  );
}
