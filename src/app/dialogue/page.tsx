"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChatInterface } from "@/components/ChatInterface";
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

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  philosopherName?: string;
}

function DialogueContent() {
  const searchParams = useSearchParams();
  const [philosophers, setPhilosophers] = useState<Philosopher[]>([]);
  const [selectedPhilosopher, setSelectedPhilosopher] = useState<Philosopher | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>("");
  const [loadingPhilosophers, setLoadingPhilosophers] = useState(true);
  const [showSelector, setShowSelector] = useState(true);
  const [lastUsedIds, setLastUsedIds] = useState<string[]>([]);

  // Handle pre-selected philosopher from query param
  useEffect(() => {
    async function initPhilosopher() {
      const philosopherId = searchParams.get("philosopher");
      if (philosopherId) {
        try {
          const res = await fetch("/api/philosophers");
          if (res.ok) {
            const data = await res.json();
            const philosopher = data.find((p: Philosopher) => p.id === philosopherId);
            if (philosopher) {
              setSelectedPhilosopher(philosopher);
              setShowSelector(false);
            }
          }
        } catch (error) {
          console.error("Failed to fetch philosopher:", error);
        }
      }
      setLoadingPhilosophers(false);
    }
    initPhilosopher();
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

  // Load last used philosophers from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("ai-phi-last-used-philosophers");
    if (stored) {
      try {
        setLastUsedIds(JSON.parse(stored));
      } catch {
        console.error("Failed to parse last used philosophers");
      }
    }
  }, []);

  const selectPhilosopher = (philosopher: Philosopher) => {
    setSelectedPhilosopher(philosopher);
    setShowSelector(false);
    setMessages([]);
    setConversationId("");

    // Save to last used
    const updatedLastUsed = [philosopher.id, ...lastUsedIds.filter(id => id !== philosopher.id)].slice(0, 5);
    setLastUsedIds(updatedLastUsed);
    localStorage.setItem("ai-phi-last-used-philosophers", JSON.stringify(updatedLastUsed));
  };

  const handleSendMessage = async (text: string) => {
    if (!selectedPhilosopher || !text.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: "You",
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const convIdToSend = conversationId || undefined;
      const provider = localStorage.getItem("ai-phi-ai-provider") || "openai";
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: convIdToSend,
          philosopherIds: [selectedPhilosopher.id],
          message: text.trim(),
          provider,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.conversationId) setConversationId(data.conversationId);

        for (const result of data.results || []) {
          const assistantMessage: Message = {
            id: `assistant-${Date.now()}-${result.philosopherId}`,
            role: "assistant",
            content: result.response || "I could not generate a response. Please try again.",
            timestamp: result.philosopherName || selectedPhilosopher.name,
          };
          setMessages((prev) => [...prev, assistantMessage]);
        }
      } else {
        const errMsg: Message = {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "Failed to get a response. Please check your API keys and try again.",
          timestamp: "Error",
        };
        setMessages((prev) => [...prev, errMsg]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errMsg: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "Network error. Please check your connection.",
        timestamp: "Error",
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = useCallback(() => {
    setShowSelector(true);
    setSelectedPhilosopher(null);
    setMessages([]);
    setConversationId("");
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !showSelector && selectedPhilosopher) {
        handleBack();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showSelector, selectedPhilosopher, handleBack]);

  return (
    <>
      <main className="pt-16 pb-40 min-h-screen">
        {/* Philosopher Selector */}
        {showSelector && (
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary">person_search</span>
              <h2 className="font-headline text-2xl uppercase tracking-widest">
                Choose Your Thinker
              </h2>
            </div>

            {loadingPhilosophers ? (
              <div className="flex items-center justify-center h-64">
                <LoadingDots />
              </div>
            ) : (
              <>
                {lastUsedIds.length > 0 && (
                  <div className="mb-6">
                    <p className="font-label text-[10px] text-zinc-500 uppercase tracking-widest mb-3">Last Used</p>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {lastUsedIds.map(id => {
                        const p = philosophers.find(ph => ph.id === id);
                        if (!p) return null;
                        return (
                          <button
                            key={p.id}
                            onClick={() => selectPhilosopher(p)}
                            className="flex-shrink-0 w-24 bg-surface-container border border-outline-variant/10 rounded-sm overflow-hidden group cursor-pointer hover:border-primary/30 transition-all text-left focus:outline-none focus:ring-2 focus:ring-primary/30"
                          >
                            <div className="h-24 relative">
                              {p.imageUrl ? (
                                <img src={p.imageUrl} alt={p.name}
                                  className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 transition-opacity" />
                              ) : (
                                <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                                  <span className="font-headline text-3xl text-zinc-600">{p.name.charAt(0)}</span>
                                </div>
                              )}
                            </div>
                            <div className="p-2">
                              <p className="font-headline text-xs uppercase tracking-tight">{p.name}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                  {philosophers
                    .filter(p => !lastUsedIds.includes(p.id))
                    .map((philosopher) => (
                  <button
                    key={philosopher.id}
                    onClick={() => selectPhilosopher(philosopher)}
                    className="bg-surface-container border border-outline-variant/10 rounded-sm overflow-hidden group cursor-pointer hover:border-primary/30 transition-all text-left focus:outline-none focus:ring-2 focus:ring-primary/30"
                    aria-label={`Select ${philosopher.name}, ${philosopher.era} ${philosopher.tradition}`}
                  >
                    <div className="h-48 relative">
                      {philosopher.imageUrl ? (
                        <img src={philosopher.imageUrl} alt={philosopher.name}
                          className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 transition-opacity" />
                      ) : (
                        <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                          <span className="font-headline text-5xl text-zinc-600" aria-hidden="true">{philosopher.name.charAt(0)}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent" />
                    </div>
                    <div className="p-3">
                      <p className="font-headline text-sm uppercase tracking-tight">{philosopher.name}</p>
                      <p className="font-label text-[8px] text-zinc-500">{philosopher.era} · {philosopher.tradition}</p>
                    </div>
                  </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Chat View */}
        {!showSelector && selectedPhilosopher && (
          <>
            {/* Philosopher context */}
            <div className="p-6 border-b border-outline-variant/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-sm overflow-hidden relative">
                  {selectedPhilosopher.imageUrl ? (
                    <img src={selectedPhilosopher.imageUrl} alt={selectedPhilosopher.name} className="w-full h-full object-cover grayscale opacity-70" />
                  ) : (
                    <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                      <span className="font-headline text-2xl text-zinc-600">{selectedPhilosopher.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="font-label text-[10px] text-primary uppercase tracking-widest">Active</span>
                  </div>
                  <p className="font-headline text-lg">{selectedPhilosopher.name}</p>
                  <p className="font-label text-[9px] text-zinc-500">{selectedPhilosopher.tradition}</p>
                </div>
                <Link href={`/debate?philosopher=${selectedPhilosopher.id}`}
                  className="px-3 py-2 bg-surface-container border border-outline-variant/30 rounded-sm font-label text-[10px] uppercase tracking-widest text-zinc-400 hover:text-primary hover:border-primary/30 transition-all">
                  + Debate
                </Link>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="h-[calc(100vh-18rem)]">
              <ChatInterface
                messages={messages.map((m) => ({
                  ...m,
                  philosopherName: m.timestamp && m.role === "assistant" ? m.timestamp : undefined,
                }))}
                onSendMessage={handleSendMessage}
                disabled={isLoading}
                philosopherName={selectedPhilosopher.name}
                mode="dialogue"
              />
            </div>
          </>
        )}
      </main>

    </>
  );
}

export default function DialoguePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <LoadingDots />
      </div>
    }>
      <DialogueContent />
    </Suspense>
  );
}
