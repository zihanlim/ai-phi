"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChatInterface } from "@/components/ChatInterface";
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
  const [showPhilosopherSelector, setShowPhilosopherSelector] = useState(true);

  // Handle pre-selected philosopher from query param
  useEffect(() => {
    async function initPhilosopher() {
      const philosopherId = searchParams.get("philosopher");
      if (philosopherId) {
        // Fetch philosophers to find the selected one
        try {
          const res = await fetch("/api/philosophers");
          if (res.ok) {
            const data = await res.json();
            const philosopher = data.find((p: Philosopher) => p.id === philosopherId);
            if (philosopher) {
              setSelectedPhilosopher(philosopher);
              setShowPhilosopherSelector(false);
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

  const selectPhilosopher = (philosopher: Philosopher) => {
    setSelectedPhilosopher(philosopher);
    setShowPhilosopherSelector(false);
    setMessages([]);
    setConversationId("");
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedPhilosopher || !content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: content,
      timestamp: "User Inquiry",
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Create or use existing conversation
      const currentConversationId = conversationId || `conv-${Date.now()}`;
      setConversationId(currentConversationId);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: currentConversationId,
          philosopherIds: [selectedPhilosopher.id],
          question: content,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Add assistant response
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.responses?.[0]?.response || "I apologize, but I could not generate a response. Please try again.",
          timestamp: `Response from ${selectedPhilosopher.name}`,
          philosopherName: selectedPhilosopher.name,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        // Error response
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "I apologize, but I could not generate a response at this time. Please try again.",
          timestamp: `Error`,
          philosopherName: selectedPhilosopher.name,
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "Network error. Please check your connection and try again.",
        timestamp: `Error`,
        philosopherName: selectedPhilosopher.name,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToSelector = () => {
    setShowPhilosopherSelector(true);
    setSelectedPhilosopher(null);
    setMessages([]);
    setConversationId("");
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-[#09090b] border-b border-[#27272a]">
        <div className="flex justify-between items-center px-6 h-16 w-full">
          <div className="flex items-center gap-4">
            {selectedPhilosopher && (
              <button
                onClick={handleBackToSelector}
                className="text-primary active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
            )}
            <h1 className="font-headline font-bold tracking-tighter uppercase text-2xl text-primary">
              DIGITAL AGORA
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {selectedPhilosopher && (
              <div className="flex flex-col items-end">
                <span className="font-label text-[10px] text-zinc-500 uppercase tracking-widest">
                  Active Logic Node
                </span>
                <span className="font-headline text-sm text-primary uppercase">
                  {selectedPhilosopher.name}
                </span>
              </div>
            )}
            <button className="text-zinc-400 hover:text-primary transition-colors duration-200 active:scale-95 transition-transform">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
        </div>
      </header>

      <main className="pt-16 min-h-screen flex flex-col">
        {/* Philosopher Selector View */}
        {showPhilosopherSelector && (
          <div className="flex-1 pb-40">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary">person_search</span>
                <h2 className="font-headline text-2xl uppercase tracking-widest">
                  Select a Philosopher
                </h2>
              </div>

              {loadingPhilosophers ? (
                <div className="flex gap-1 items-center justify-center h-64">
                  <span className="font-label text-primary text-xl blinking-cursor">_</span>
                  <span className="font-label text-primary text-xl opacity-40">_</span>
                  <span className="font-label text-primary text-xl opacity-20">_</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {philosophers.map((philosopher) => (
                    <button
                      key={philosopher.id}
                      onClick={() => selectPhilosopher(philosopher)}
                      className="bg-surface-container border border-outline-variant/10 rounded-sm overflow-hidden group cursor-pointer hover:border-primary/30 transition-all text-left"
                    >
                      <div className="h-32 relative overflow-hidden">
                        {philosopher.imageUrl ? (
                          <img
                            src={philosopher.imageUrl}
                            alt={philosopher.name}
                            className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                            <span className="font-headline text-5xl text-zinc-600">
                              {philosopher.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent" />
                      </div>
                      <div className="p-4">
                        <p className="font-headline text-lg uppercase tracking-tight">
                          {philosopher.name}
                        </p>
                        <p className="font-label text-[9px] text-zinc-500">
                          {philosopher.era} · {philosopher.tradition}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chat View */}
        {!showPhilosopherSelector && selectedPhilosopher && (
          <>
            {/* Philosopher Context Header */}
            <div className="p-6 border-b border-outline-variant/20">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-sm overflow-hidden relative">
                  {selectedPhilosopher.imageUrl ? (
                    <img
                      src={selectedPhilosopher.imageUrl}
                      alt={selectedPhilosopher.name}
                      className="w-full h-full object-cover grayscale opacity-70"
                    />
                  ) : (
                    <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                      <span className="font-headline text-3xl text-zinc-600">
                        {selectedPhilosopher.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,255,163,0.5)]" />
                    <span className="font-label text-[10px] text-primary uppercase tracking-widest">
                      Active Session
                    </span>
                  </div>
                  <h2 className="font-headline text-2xl mt-1">
                    {selectedPhilosopher.name}
                  </h2>
                  <p className="font-label text-[10px] text-zinc-500">
                    {selectedPhilosopher.era} · {selectedPhilosopher.tradition}
                  </p>
                </div>
                <Link
                  href={`/debate?philosopher=${selectedPhilosopher.id}`}
                  className="px-4 py-2 bg-surface-container border border-outline-variant/30 rounded-sm font-label text-[10px] uppercase tracking-widest text-zinc-400 hover:text-primary hover:border-primary/30 transition-all"
                >
                  Add to Debate
                </Link>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto pb-40">
              {messages.length === 0 && (
                <div className="p-6 text-center">
                  <span className="material-symbols-outlined text-6xl text-zinc-600 mb-4 block">
                    chat
                  </span>
                  <h3 className="font-headline text-xl text-zinc-400 mb-2">
                    Begin Your Dialogue
                  </h3>
                  <p className="text-on-surface-variant text-sm max-w-md mx-auto">
                    You are now conversing with {selectedPhilosopher.name}. 
                    Ask questions, explore ideas, and engage with their philosophical perspective.
                  </p>
                </div>
              )}

              <div className="space-y-6 p-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex flex-col gap-2 ${
                      message.role === "user"
                        ? "items-end max-w-[80%] ml-auto"
                        : "items-start max-w-[85%]"
                    }`}
                  >
                    {message.timestamp && (
                      <div className="font-label text-[10px] text-zinc-500 uppercase tracking-widest px-1">
                        {message.timestamp}
                      </div>
                    )}
                    {message.role === "assistant" ? (
                      <div className="bg-surface-container p-6 border-l-2 border-primary rounded-sm">
                        <p className="text-lg leading-relaxed text-on-surface font-body whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                    ) : (
                      <div className="border border-outline-variant/30 p-6 bg-surface-container-low rounded-sm">
                        <p className="text-lg leading-relaxed text-zinc-300 whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex flex-col items-start gap-2">
                    <div className="font-label text-[10px] text-zinc-500 uppercase tracking-widest px-1">
                      {selectedPhilosopher.name} is thinking...
                    </div>
                    <div className="flex gap-1 items-center px-1">
                      <span className="font-label text-primary text-xl blinking-cursor">_</span>
                      <span className="font-label text-primary text-xl opacity-40">_</span>
                      <span className="font-label text-primary text-xl opacity-20">_</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input Area */}
            <section className="fixed bottom-20 left-0 w-full z-40 bg-surface/95 backdrop-blur-xl border-t border-outline-variant">
              <div className="max-w-4xl mx-auto px-6 pt-4 pb-6">
                <div className="relative bg-surface-container-lowest border-b border-primary flex items-end p-2 transition-all focus-within:bg-surface-container">
                  <textarea
                    value=""
                    onChange={() => {}}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                      }
                    }}
                    placeholder={`Message ${selectedPhilosopher.name}...`}
                    rows={1}
                    className="w-full bg-transparent border-none focus:ring-0 text-on-surface font-body resize-none py-3 px-4 placeholder:text-zinc-600 placeholder:font-label placeholder:text-xs placeholder:tracking-widest"
                    disabled={isLoading}
                    id="dialogue-input"
                  />
                  <button
                    onClick={() => {
                      const input = document.getElementById("dialogue-input") as HTMLTextAreaElement;
                      if (input && input.value.trim()) {
                        handleSendMessage(input.value);
                        input.value = "";
                      }
                    }}
                    disabled={isLoading}
                    className={`h-10 w-10 flex items-center justify-center rounded-sm transition-all active:scale-90 ${
                      isLoading
                        ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                        : "bg-primary text-surface-container-lowest hover:shadow-[0_0_15px_rgba(0,255,163,0.4)]"
                    }`}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      send
                    </span>
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <Navigation />
    </>
  );
}

export default function DialoguePage() {
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
      <DialogueContent />
    </Suspense>
  );
}
