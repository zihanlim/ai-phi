"use client";

import { useState, useEffect, useRef, Suspense, ChangeEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>("");
  const [loadingPhilosophers, setLoadingPhilosophers] = useState(true);
  const [showSelector, setShowSelector] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoGrow = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const selectPhilosopher = (philosopher: Philosopher) => {
    setSelectedPhilosopher(philosopher);
    setShowSelector(false);
    setMessages([]);
    setConversationId("");
  };

  const handleSendMessage = async (text?: string) => {
    const textToSend = text || inputValue;
    if (!selectedPhilosopher || !textToSend.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend.trim(),
      timestamp: "You",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const convIdToSend = conversationId || undefined;
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: convIdToSend,
          philosopherIds: [selectedPhilosopher.id],
          message: textToSend.trim(),
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

  const handleBack = () => {
    setShowSelector(true);
    setSelectedPhilosopher(null);
    setMessages([]);
    setConversationId("");
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-[#09090b] border-b border-[#27272a]">
        <div className="flex justify-between items-center px-6 h-16">
          <div className="flex items-center gap-4">
            {selectedPhilosopher ? (
              <button onClick={handleBack} className="text-primary active:scale-95 transition-transform">
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
            ) : (
              <span className="material-symbols-outlined text-primary">menu</span>
            )}
            <h1 className="font-headline font-bold tracking-tighter uppercase text-2xl text-primary">
              {selectedPhilosopher ? selectedPhilosopher.name : "Dialogue"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {selectedPhilosopher && (
              <span className="font-label text-[10px] text-secondary uppercase tracking-widest hidden md:block">
                {selectedPhilosopher.tradition}
              </span>
            )}
            <span className="material-symbols-outlined text-zinc-400">notifications</span>
          </div>
        </div>
      </header>

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
              <div className="flex gap-1 items-center justify-center h-64">
                <span className="font-label text-primary text-xl blinking-cursor">_</span>
                <span className="font-label text-primary text-xl opacity-40">_</span>
                <span className="font-label text-primary text-xl opacity-20">_</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {philosophers.map((philosopher) => (
                  <button
                    key={philosopher.id}
                    onClick={() => selectPhilosopher(philosopher)}
                    className="bg-surface-container border border-outline-variant/10 rounded-sm overflow-hidden group cursor-pointer hover:border-primary/30 transition-all text-left"
                  >
                    <div className="h-64 relative">
                      {philosopher.imageUrl ? (
                        <img src={philosopher.imageUrl} alt={philosopher.name}
                          className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 transition-opacity" />
                      ) : (
                        <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                          <span className="font-headline text-5xl text-zinc-600">{philosopher.name.charAt(0)}</span>
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

            {/* Messages */}
            <div className="p-6 space-y-6">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <span className="material-symbols-outlined text-5xl text-zinc-600 mb-3 block">chat</span>
                  <p className="text-on-surface-variant text-sm max-w-sm mx-auto">
                    Begin a dialogue with {selectedPhilosopher.name}. Ask about their ideas, works, or present a philosophical question.
                  </p>
                </div>
              )}

              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  {msg.timestamp && (
                    <span className="font-label text-[9px] text-zinc-600 uppercase tracking-widest px-1">{msg.timestamp}</span>
                  )}
                  <div className={`max-w-[85%] rounded-sm p-4 ${msg.role === "user" ? "bg-primary/10 border border-primary/20" : "bg-surface-container border-l-2 border-primary"}`}>
                    <p className="text-on-surface whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex flex-col gap-1 items-start">
                  <span className="font-label text-[9px] text-zinc-600 uppercase tracking-widest px-1">
                    {selectedPhilosopher.name} is thinking...
                  </span>
                  <div className="flex gap-1 px-1">
                    <span className="font-label text-primary text-xl blinking-cursor">_</span>
                    <span className="font-label text-primary text-xl opacity-40">_</span>
                    <span className="font-label text-primary text-xl opacity-20">_</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </>
        )}
      </main>

      {/* Input — only shown when a philosopher is selected */}
      {!showSelector && selectedPhilosopher && (
        <div className="fixed bottom-0 left-0 w-full z-40 bg-surface/95 backdrop-blur-xl border-t border-outline-variant">
          <div className="max-w-3xl mx-auto px-6 py-4 flex gap-3">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                autoGrow(e);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={`Ask ${selectedPhilosopher.name}...`}
              rows={1}
              className="flex-1 bg-surface-container-low border border-outline-variant/30 rounded-sm px-4 py-3 text-on-surface placeholder:text-zinc-600 focus:outline-none focus:border-primary transition-colors min-h-[48px] overflow-y-hidden"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputValue.trim()}
              className={`px-5 py-3 rounded-sm font-headline font-bold uppercase tracking-widest transition-all active:scale-95 ${
                isLoading || !inputValue.trim()
                  ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                  : "bg-primary text-surface-container-lowest hover:shadow-[0_0_20px_rgba(0,255,163,0.4)]"
              }`}
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      )}

      <Navigation />
    </>
  );
}

export default function DialoguePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex gap-1">
          <span className="font-label text-primary text-xl blinking-cursor">_</span>
          <span className="font-label text-primary text-xl opacity-40">_</span>
          <span className="font-label text-primary text-xl opacity-20">_</span>
        </div>
      </div>
    }>
      <DialogueContent />
    </Suspense>
  );
}
