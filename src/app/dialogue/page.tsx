"use client";

import { useState, useEffect, Suspense, useCallback, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChatInterface } from "@/components/ChatInterface";
import { LoadingDots } from "@/components/LoadingDots";
import { philosopherContent } from "@/lib/philosopher-content";

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
  const [lastDiscussedMap, setLastDiscussedMap] = useState<Record<string, { topic: string; date: string }>>({});
  const [conversationCountMap, setConversationCountMap] = useState<Record<string, number>>({});
  const [lastMessageTopic, setLastMessageTopic] = useState<string>("");
  const [philosopherConversationMap, setPhilosopherConversationMap] = useState<Record<string, string>>({});

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

              // Try to find existing conversation in localStorage first
              const convMapStored = localStorage.getItem("ai-phi-philosopher-conversations");
              let existingConvId: string | null = null;
              
              if (convMapStored) {
                try {
                  const convMap = JSON.parse(convMapStored);
                  existingConvId = convMap[philosopherId] || null;
                } catch (e) {
                  console.error("Failed to parse conversation map:", e);
                }
              }

              // If no localStorage mapping, check with backend API for user's conversations
              if (!existingConvId) {
                try {
                  const convRes = await fetch(`/api/conversations?userId=null&philosopherId=${philosopherId}`);
                  if (convRes.ok) {
                    const convData = await convRes.json();
                    // Find the most recent conversation with this philosopher
                    const matchingConv = convData.find((c: { philosopherIds: string[] }) => 
                      c.philosopherIds.includes(philosopherId)
                    );
                    if (matchingConv) {
                      existingConvId = matchingConv.id;
                      // Update localStorage for future use
                      const newConvMap = { ...(convMapStored ? JSON.parse(convMapStored) : {}) };
                      newConvMap[philosopherId] = existingConvId;
                      localStorage.setItem("ai-phi-philosopher-conversations", JSON.stringify(newConvMap));
                    }
                  }
                } catch (e) {
                  console.error("Failed to fetch conversation from API:", e);
                }
              }

              // Load existing conversation if found
              if (existingConvId) {
                setConversationId(existingConvId);
                try {
                  const msgRes = await fetch(`/api/chat?conversationId=${existingConvId}`);
                  if (msgRes.ok) {
                    const existingMessages = await msgRes.json();
                    const mappedMessages = existingMessages
                      .filter((m: { role: string; content: string }) => m.role === "user" || m.role === "assistant")
                      .map((m: { role: string; content: string }, idx: number) => ({
                        id: `loaded-${idx}`,
                        role: m.role as "user" | "assistant",
                        content: m.content,
                        timestamp: m.role === "user" ? "You" : philosopher.name,
                      }));
                    setMessages(mappedMessages);
                    
                    // Set last message topic from the last user message
                    const lastUserMsg = [...mappedMessages].reverse().find((m: Message) => m.role === "user");
                    if (lastUserMsg) {
                      setLastMessageTopic(lastUserMsg.content);
                    }
                  }
                } catch (e) {
                  console.error("Failed to load messages:", e);
                }
              }
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
    // Load conversation history
    const historyStored = localStorage.getItem("ai-phi-conversation-history");
    if (historyStored) {
      try {
        setLastDiscussedMap(JSON.parse(historyStored));
      } catch {
        console.error("Failed to parse conversation history");
      }
    }
    // Load conversation counts
    const countsStored = localStorage.getItem("ai-phi-conversation-counts");
    if (countsStored) {
      try {
        setConversationCountMap(JSON.parse(countsStored));
      } catch {
        console.error("Failed to parse conversation counts");
      }
    }
    // Load philosopher to conversation ID mapping
    const convMapStored = localStorage.getItem("ai-phi-philosopher-conversations");
    if (convMapStored) {
      try {
        setPhilosopherConversationMap(JSON.parse(convMapStored));
      } catch {
        console.error("Failed to parse philosopher conversation map");
      }
    }
  }, []);

  const selectPhilosopher = async (philosopher: Philosopher) => {
    setSelectedPhilosopher(philosopher);
    setShowSelector(false);
    setLastMessageTopic("");

    // Check if there's an existing conversation for this philosopher
    const existingConvId = philosopherConversationMap[philosopher.id];
    
    if (existingConvId) {
      // Load existing conversation from API
      setConversationId(existingConvId);
      try {
        const res = await fetch(`/api/chat?conversationId=${existingConvId}`);
        if (res.ok) {
          const existingMessages = await res.json();
          // Filter to only messages for this philosopher in dialogue mode (single philosopher)
          const mappedMessages = existingMessages
            .filter((m: { role: string; content: string }) => m.role === "user" || m.role === "assistant")
            .map((m: { role: string; content: string; createdAt?: string }, idx: number) => ({
              id: `loaded-${idx}`,
              role: m.role as "user" | "assistant",
              content: m.content,
              timestamp: m.role === "user" ? "You" : philosopher.name,
            }));
          setMessages(mappedMessages);
          
          // Get the last user message as the topic
          const lastUserMsg = [...mappedMessages].reverse().find((m: Message) => m.role === "user");
          if (lastUserMsg) {
            setLastMessageTopic(lastUserMsg.content);
          }
        }
      } catch (error) {
        console.error("Failed to load existing conversation:", error);
        setMessages([]);
        setConversationId("");
      }
    } else {
      setMessages([]);
      setConversationId("");
    }

    // Save to last used
    const updatedLastUsed = [philosopher.id, ...lastUsedIds.filter(id => id !== philosopher.id)].slice(0, 5);
    setLastUsedIds(updatedLastUsed);
    localStorage.setItem("ai-phi-last-used-philosophers", JSON.stringify(updatedLastUsed));
  };

  const handleSendMessage = async (text: string) => {
    if (!selectedPhilosopher || !text.trim()) return;

    // Track last message topic for this philosopher
    setLastMessageTopic(text.trim());

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
        if (data.conversationId) {
          setConversationId(data.conversationId);
          
          // Save philosopher -> conversationId mapping
          const newConvMap = {
            ...philosopherConversationMap,
            [selectedPhilosopher.id]: data.conversationId,
          };
          setPhilosopherConversationMap(newConvMap);
          localStorage.setItem("ai-phi-philosopher-conversations", JSON.stringify(newConvMap));
        }

        for (const result of data.results || []) {
          const assistantMessage: Message = {
            id: `assistant-${Date.now()}-${result.philosopherId}`,
            role: "assistant",
            content: result.response || "I could not generate a response. Please try again.",
            timestamp: result.philosopherName || selectedPhilosopher.name,
          };
          setMessages((prev) => [...prev, assistantMessage]);
        }

        // Update conversation history and counts
        const newHistory = {
          ...lastDiscussedMap,
          [selectedPhilosopher.id]: {
            topic: text.trim().slice(0, 50),
            date: new Date().toISOString(),
          },
        };
        setLastDiscussedMap(newHistory);
        localStorage.setItem("ai-phi-conversation-history", JSON.stringify(newHistory));

        const newCounts = {
          ...conversationCountMap,
          [selectedPhilosopher.id]: (conversationCountMap[selectedPhilosopher.id] || 0) + 1,
        };
        setConversationCountMap(newCounts);
        localStorage.setItem("ai-phi-conversation-counts", JSON.stringify(newCounts));
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
        {!showSelector && selectedPhilosopher && (() => {
          const content = philosopherContent[selectedPhilosopher.id];
          const suggestedPrompts = content?.suggestedPrompts?.slice(0, 3) || [];
          const followUpSuggestions = content?.followUpSuggestions 
            ? content.followUpSuggestions(lastMessageTopic || suggestedPrompts[0] || "")
            : [];
          
          return (
          <>
            {/* Philosopher context - Large header with background */}
            <div className="relative h-48 overflow-hidden">
              {/* Background image */}
              {selectedPhilosopher.imageUrl ? (
                <img
                  src={selectedPhilosopher.imageUrl}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-surface-container to-surface" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent" />
              
              {/* Content */}
              <div className="relative z-10 p-6 flex items-end gap-4 h-full">
                <div className="w-20 h-20 rounded-sm overflow-hidden border-2 border-primary/30 shadow-lg">
                  {selectedPhilosopher.imageUrl ? (
                    <img src={selectedPhilosopher.imageUrl} alt={selectedPhilosopher.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                      <span className="font-headline text-4xl text-zinc-600">{selectedPhilosopher.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="font-label text-[10px] text-primary uppercase tracking-widest">Active</span>
                  </div>
                  <p className="font-headline text-2xl">{selectedPhilosopher.name}</p>
                  <p className="font-label text-[9px] text-zinc-400">{selectedPhilosopher.era} · {selectedPhilosopher.tradition}</p>
                </div>
                <Link href={`/arena?philosopher=${selectedPhilosopher.id}`}
                  className="px-3 py-2 bg-surface-container border border-outline-variant/30 rounded-sm font-label text-[10px] uppercase tracking-widest text-zinc-400 hover:text-primary hover:border-primary/30 transition-all mb-1">
                  + Compare
                </Link>
              </div>
            </div>

            {/* Context indicator for resumed conversations */}
            {lastDiscussedMap[selectedPhilosopher.id] && messages.length === 0 && (
              <div className="px-6 py-2 border-b border-outline-variant/20 bg-surface-container/50">
                <div className="flex items-center gap-2 text-xs text-primary">
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  <span>
                    Resuming conversation about "{lastDiscussedMap[selectedPhilosopher.id].topic}"
                  </span>
                </div>
              </div>
            )}

            {/* Memories - past conversation snippets */}
            {messages.length > 2 && (
              <div className="px-6 py-3 border-b border-outline-variant/20 bg-surface-container/50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-sm text-primary">history</span>
                  <p className="font-label text-[10px] text-zinc-500 uppercase tracking-widest">Memories</p>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {messages.slice(0, -1).filter(m => m.role === "user").slice(-3).map((msg, i) => (
                    <div key={i} className="flex-shrink-0 px-3 py-2 bg-surface-container-high rounded-sm text-xs text-on-surface-variant max-w-[200px] truncate">
                      You: {msg.content.slice(0, 50)}...
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Interface */}
            <div className="flex-1 min-h-0">
              <ChatInterface
                messages={messages.map((m) => ({
                  ...m,
                  philosopherName: m.timestamp && m.role === "assistant" ? m.timestamp : undefined,
                }))}
                onSendMessage={handleSendMessage}
                disabled={isLoading}
                philosopherName={selectedPhilosopher.name}
                philosopherBio={selectedPhilosopher.bio}
                showTypingIndicator={isLoading}
                mode="dialogue"
                suggestedPrompts={suggestedPrompts}
                followUpSuggestions={followUpSuggestions}
              />
            </div>
          </>
          );
        })()}
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
