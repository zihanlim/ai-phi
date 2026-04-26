"use client";

import {
  useState,
  useEffect,
  Suspense,
  useCallback,
  useRef,
  ChangeEvent,
} from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ComparisonView } from "@/components/ComparisonView";
import { ChatInterface } from "@/components/ChatInterface";
import { LoadingDots } from "@/components/LoadingDots";
import { philosopherContent } from "@/lib/philosopher-content";

type Mode = "single" | "compare";

// Category filters
const categories = [
  { id: "all", label: "All" },
  { id: "philosophers", label: "Philosophers" },
  { id: "macro", label: "Macro" },
  { id: "risk", label: "Risk" },
  { id: "value", label: "Value" },
  { id: "quant", label: "Quant" },
  { id: "behavioral", label: "Behavioral" },
];

const categoryPhilosophers: Record<string, string[]> = {
  philosophers: [
    "socrates",
    "plato",
    "aristotle",
    "confucius",
    "lao-tzu",
    "nietzsche",
    "simone-de-beauvoir",
    "frantz-fanon",
    "wang-yangming",
  ],
  macro: ["ray-dalio", "stanley-druckenmiller", "jeff-gundlach"],
  risk: ["nassim-taleb", "howard-marks"],
  value: ["warren-buffett", "seth-klarman"],
  quant: ["jim-simons", "david-shaw"],
  behavioral: ["morgan-housel"],
};

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
  question?: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  philosopherName?: string;
}

// Module-level variable to persist conversation ID across component re-mounts
let moduleConversationId: string | null = null;

function ArenaContent() {
  const searchParams = useSearchParams();
  const [philosophers, setPhilosophers] = useState<Philosopher[]>([]);
  const [mode, setMode] = useState<Mode>("compare");
  const [selectedPhilosophers, setSelectedPhilosophers] = useState<string[]>(
    [],
  );
  const [selectedPhilosopher, setSelectedPhilosopher] =
    useState<Philosopher | null>(null);
  const [question, setQuestion] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [comparisonMessages, setComparisonMessages] = useState<
    ComparisonMessage[]
  >([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [loadingPhilosophers, setLoadingPhilosophers] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [lastMessageTopic, setLastMessageTopic] = useState<string>("");
  const [lastUsedIds, setLastUsedIds] = useState<string[]>([]);
  const [lastDiscussedMap, setLastDiscussedMap] = useState<
    Record<string, { topic: string; date: string }>
  >({});
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isLoadingMessagesRef = useRef(false);
  const loadingConvIdRef = useRef<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const autoGrow = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, []);

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

  // Load localStorage data
  useEffect(() => {
    const stored = localStorage.getItem("ai-phi-last-used-philosophers");
    if (stored) {
      try {
        setLastUsedIds(JSON.parse(stored));
      } catch {
        console.error("Failed to parse last used philosophers");
      }
    }
    const historyStored = localStorage.getItem("ai-phi-conversation-history");
    if (historyStored) {
      try {
        setLastDiscussedMap(JSON.parse(historyStored));
      } catch {
        console.error("Failed to parse conversation history");
      }
    }
  }, []);

  // Handle pre-selected philosopher(s) from query param
  useEffect(() => {
    // Get philosopher IDs from either "philosopher" or "philosophers" param
    const philosopherIdsFromSingle = searchParams.getAll("philosopher");
    const philosopherIdsFromMultiple = searchParams.get("philosophers")?.split(",") || [];
    const philosopherIds = philosopherIdsFromSingle.length > 0 ? philosopherIdsFromSingle : philosopherIdsFromMultiple;
    
    // Get mode from query param
    const modeParam = searchParams.get("mode");
    
    if (philosopherIds.length > 0) {
      // Determine mode based on param or number of philosophers
      let targetMode: Mode = "compare";
      if (modeParam === "single") {
        targetMode = "single";
      } else if (modeParam === "compare") {
        targetMode = "compare";
      } else {
        targetMode = philosopherIds.length > 1 ? "compare" : "single";
      }
      setMode(targetMode);

      if (philosophers.length === 0) {
        fetch("/api/philosophers")
          .then((res) => (res.ok ? res.json() : []))
          .then((data: Philosopher[]) => {
            const matchedPhilosophers = data.filter((p) =>
              philosopherIds.includes(p.id),
            );
            if (matchedPhilosophers.length > 0) {
              handleSelectPhilosopher(matchedPhilosophers, targetMode);
            }
          });
      } else {
        const matchedPhilosophers = philosophers.filter((p) =>
          philosopherIds.includes(p.id),
        );
        if (matchedPhilosophers.length > 0) {
          handleSelectPhilosopher(matchedPhilosophers, targetMode);
        }
      }
    }
  }, [searchParams, philosophers]);

  const handleSelectPhilosopher = (
    philosophersToSelect: Philosopher | Philosopher[],
    forcedMode?: Mode,
  ) => {
    // Normalize input to array
    const philosopherArray = Array.isArray(philosophersToSelect)
      ? philosophersToSelect
      : [philosophersToSelect];
    const firstPhilosopher = philosopherArray[0];
    const selectedIds = philosopherArray.map((p) => p.id);
    const targetMode =
      forcedMode || (philosopherArray.length > 1 ? "compare" : "single");

    setSelectedPhilosopher(firstPhilosopher);
    setSelectedPhilosophers(selectedIds);
    setMode(targetMode);
    setLastMessageTopic("");
    setChatMessages([]);
    setComparisonMessages([]);
    setShowResults(false);

    // Load existing conversation
    const convMapStored = localStorage.getItem(
      "ai-phi-philosopher-conversations",
    );

    if (targetMode === "single" && firstPhilosopher) {
      // Single mode: check localStorage directly
      let existingConvId: string | null = null;

      if (convMapStored) {
        try {
          const convMap = JSON.parse(convMapStored);
          existingConvId = convMap[firstPhilosopher.id] || null;
        } catch (e) {
          console.error("Failed to parse conversation map:", e);
        }
      }

      if (existingConvId) {
        loadConversationMessages(existingConvId, selectedIds, philosopherArray);
      }
    } else if (targetMode === "compare" && philosopherArray.length > 1) {
      // Compare mode: fetch from API and find matching conversation
      const primaryPhilosopherId = selectedIds[0];
      let existingConvId: string | null = null;

      if (convMapStored) {
        try {
          const convMap = JSON.parse(convMapStored);
          existingConvId = convMap[primaryPhilosopherId] || null;
        } catch (e) {
          console.error("Failed to parse conversation map:", e);
        }
      }

      if (existingConvId) {
        loadConversationMessages(existingConvId, selectedIds, philosopherArray);
      } else {
        // Try to find by fetching conversations from API
        fetch("/api/conversations")
          .then((res) => (res.ok ? res.json() : []))
          .then((data) => {
            // Find conversation that includes ALL selected philosophers
            const matchingConv = data.find(
              (conv: { philosopherIds?: string[]; id?: string }) =>
                conv.philosopherIds &&
                conv.philosopherIds.length === selectedIds.length &&
                selectedIds.every((id) => conv.philosopherIds!.includes(id)),
            );
            if (matchingConv && matchingConv.id) {
              const convId = matchingConv.id;
              // Update localStorage
              if (convMapStored) {
                const newConvMap = JSON.parse(convMapStored);
                newConvMap[primaryPhilosopherId] = convId;
                localStorage.setItem(
                  "ai-phi-philosopher-conversations",
                  JSON.stringify(newConvMap),
                );
              }
              loadConversationMessages(convId, selectedIds, philosopherArray);
            }
          })
          .catch((e) => console.error("Failed to fetch conversations:", e));
      }
    }

    // Update last used
    const updatedLastUsed = [
      ...selectedIds,
      ...lastUsedIds.filter((id) => !selectedIds.includes(id)),
    ].slice(0, 5);
    setLastUsedIds(updatedLastUsed);
    localStorage.setItem(
      "ai-phi-last-used-philosophers",
      JSON.stringify(updatedLastUsed),
    );
  };

  const togglePhilosopher = (id: string) => {
    setSelectedPhilosophers((prev) => {
      if (prev.includes(id)) {
        return prev.filter((p) => p !== id);
      }
      return [...prev, id];
    });
    setShowResults(false);
    setComparisonMessages([]);
    setConversationId(null);
    setCurrentRound(0);
  };

  const loadConversationMessages = async (
    convId: string,
    philosopherIds: string[],
    availablePhilosophers?: Philosopher[],
  ) => {
    if (isLoadingMessagesRef.current && loadingConvIdRef.current === convId) {
      return;
    }
    isLoadingMessagesRef.current = true;
    loadingConvIdRef.current = convId;
    setIsLoadingMessages(true);
    setShowResults(true);

    try {
      const msgRes = await fetch(`/api/chat?conversationId=${convId}`);
      if (msgRes.ok) {
        const existingMessages = await msgRes.json();

        if (mode === "single" && philosopherIds.length === 1) {
          // Load as chat messages
          const mappedMessages = existingMessages
            .filter(
              (m: { role: string; content: string }) =>
                m.role === "user" || m.role === "assistant",
            )
            .map((m: { role: string; content: string }, idx: number) => ({
              id: `loaded-${idx}`,
              role: m.role as "user" | "assistant",
              content: m.content,
              timestamp:
                m.role === "user"
                  ? "You"
                  : philosopherIds[0]
                    ? availablePhilosophers?.find(
                        (p) => p.id === philosopherIds[0],
                      )?.name || "Thinker"
                    : "Thinker",
            }));
          setChatMessages(mappedMessages);
          const lastUserMsg = [...mappedMessages]
            .reverse()
            .find((m: ChatMessage) => m.role === "user");
          if (lastUserMsg) {
            setLastMessageTopic(lastUserMsg.content);
          }
        } else {
          // Load as comparison messages
          const transformedMessages: ComparisonMessage[] = [];
          let currentRoundMsgs: {
            philosopherId: string;
            philosopherName: string;
            content: string;
          }[] = [];
          let currentRound = 0;
          let lastUserQuestion = "";

          existingMessages.forEach(
            (m: {
              role: string;
              content: string;
              philosopherId?: string;
              philosopherName?: string;
            }) => {
              if (m.role === "user") {
                lastUserQuestion = m.content;
                setQuestion(m.content);
                setLastMessageTopic(m.content);
              } else if (m.role === "assistant") {
                let philosopherId = m.philosopherId;
                if (!philosopherId) {
                  philosopherId =
                    philosopherIds[
                      currentRoundMsgs.length % philosopherIds.length
                    ];
                }
                const philosopherName =
                  m.philosopherName ||
                  availablePhilosophers?.find((p) => p.id === philosopherId)
                    ?.name ||
                  "Thinker";

                currentRoundMsgs.push({
                  philosopherId,
                  philosopherName,
                  content: m.content,
                });

                if (currentRoundMsgs.length === philosopherIds.length) {
                  currentRoundMsgs.forEach((msg, i) => {
                    transformedMessages.push({
                      id: `loaded-${transformedMessages.length}-${i}`,
                      philosopherId: msg.philosopherId,
                      philosopherName: msg.philosopherName,
                      content: msg.content,
                      round: currentRound,
                      question: lastUserQuestion,
                    });
                  });
                  currentRoundMsgs = [];
                  lastUserQuestion = "";
                  currentRound++;
                }
              }
            },
          );

          if (currentRoundMsgs.length > 0) {
            currentRoundMsgs.forEach((msg, i) => {
              transformedMessages.push({
                id: `loaded-${transformedMessages.length}-${i}`,
                philosopherId: msg.philosopherId,
                philosopherName: msg.philosopherName,
                content: msg.content,
                round: currentRound,
                question: lastUserQuestion,
              });
            });
          }

          if (transformedMessages.length > 0) {
            setComparisonMessages(transformedMessages);
            setSelectedPhilosophers(philosopherIds);
            setCurrentRound(currentRound);
          }
        }

        setConversationId(convId);
        conversationIdRef.current = convId;
        moduleConversationId = convId;
      }
    } catch (e) {
      console.error("Failed to load messages:", e);
    } finally {
      setIsLoadingMessages(false);
      isLoadingMessagesRef.current = false;
    }
  };

  const handleSubmitQuestion = async () => {
    if (!question.trim() || selectedPhilosophers.length < 1) return;

    setIsLoading(true);
    setShowResults(true);
    const round = currentRound;
    const currentQuestion = question;

    try {
      const provider = localStorage.getItem("ai-phi-ai-provider") || "openai";
      const currentConvId = conversationIdRef.current ?? moduleConversationId;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: currentConvId,
          philosopherIds: selectedPhilosophers,
          message: question,
          provider,
        }),
      });

      if (res.ok) {
        const data = await res.json();

        if (!data.results || !Array.isArray(data.results)) {
          console.error("Invalid API response:", data);
          setIsLoading(false);
          return;
        }

        if (data.conversationId) {
          const newConvId = data.conversationId;
          setConversationId(newConvId);
          conversationIdRef.current = newConvId;
          moduleConversationId = newConvId;

          // Update localStorage mappings
          const convMapStored = localStorage.getItem(
            "ai-phi-philosopher-conversations",
          );
          const newConvMap = convMapStored ? JSON.parse(convMapStored) : {};
          selectedPhilosophers.forEach((pId) => {
            newConvMap[pId] = newConvId;
          });
          localStorage.setItem(
            "ai-phi-philosopher-conversations",
            JSON.stringify(newConvMap),
          );

          const historyStored = localStorage.getItem(
            "ai-phi-conversation-history",
          );
          const newHistory = historyStored ? JSON.parse(historyStored) : {};
          const convType =
            selectedPhilosopherData.length > 1 ? "debate" : "dialogue";
          selectedPhilosophers.forEach((pId) => {
            newHistory[pId] = {
              topic: question.trim().slice(0, 50),
              date: new Date().toISOString(),
              type: convType,
              philosopherIds: selectedPhilosopherData.map((p) => p.id),
            };
          });
          localStorage.setItem(
            "ai-phi-conversation-history",
            JSON.stringify(newHistory),
          );
        }

        if (mode === "single" && selectedPhilosophers.length === 1) {
          // Add as chat message
          const assistantMessage: ChatMessage = {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: data.results[0]?.response || "No response received.",
            timestamp: selectedPhilosophers[0]
              ? philosophers.find((p) => p.id === selectedPhilosophers[0])
                  ?.name || "Thinker"
              : "Thinker",
          };
          setChatMessages((prev) => [
            ...prev,
            {
              id: `user-${Date.now()}`,
              role: "user",
              content: currentQuestion,
              timestamp: "You",
            },
            assistantMessage,
          ]);
          setLastMessageTopic(currentQuestion);
        } else {
          // Add as comparison messages
          const newMessages: ComparisonMessage[] = data.results
            .filter(
              (r: { response: string | null; error: string | null }) =>
                r.response && !r.error,
            )
            .map(
              (
                response: {
                  philosopherId: string;
                  philosopherName: string;
                  response: string;
                },
                idx: number,
              ) => ({
                id: `msg-${Date.now()}-${idx}`,
                philosopherId: response.philosopherId,
                philosopherName: response.philosopherName,
                content: response.response,
                round,
                question: currentQuestion,
              }),
            );

          if (newMessages.length > 0) {
            setComparisonMessages((prev) => [...prev, ...newMessages]);
            setCurrentRound(round + 1);
          }
        }
      }
    } catch (error) {
      console.error("Failed to submit question:", error);
    } finally {
      setIsLoading(false);
      setQuestion("");
    }
  };

  const handleSendChatMessage = async (text: string) => {
    if (!selectedPhilosopher || !text.trim()) return;

    setLastMessageTopic(text.trim());
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: "You",
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const currentConvId = conversationIdRef.current ?? moduleConversationId;
      const provider = localStorage.getItem("ai-phi-ai-provider") || "openai";
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: currentConvId,
          philosopherIds: [selectedPhilosopher.id],
          message: text.trim(),
          provider,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.conversationId) {
          setConversationId(data.conversationId);
          conversationIdRef.current = data.conversationId;
          moduleConversationId = data.conversationId;

          const convMapStored = localStorage.getItem(
            "ai-phi-philosopher-conversations",
          );
          const newConvMap = convMapStored ? JSON.parse(convMapStored) : {};
          newConvMap[selectedPhilosopher.id] = data.conversationId;
          localStorage.setItem(
            "ai-phi-philosopher-conversations",
            JSON.stringify(newConvMap),
          );
        }

        for (const result of data.results || []) {
          const assistantMessage: ChatMessage = {
            id: `assistant-${Date.now()}-${result.philosopherId}`,
            role: "assistant",
            content: result.response || "I could not generate a response.",
            timestamp: result.philosopherName || selectedPhilosopher.name,
          };
          setChatMessages((prev) => [...prev, assistantMessage]);
        }

        // Update history
        const historyStored = localStorage.getItem(
          "ai-phi-conversation-history",
        );
        const newHistory = historyStored ? JSON.parse(historyStored) : {};
        newHistory[selectedPhilosopher.id] = {
          topic: text.trim().slice(0, 50),
          date: new Date().toISOString(),
          type: "dialogue",
          philosopherIds: [selectedPhilosopher.id],
        };
        localStorage.setItem(
          "ai-phi-conversation-history",
          JSON.stringify(newHistory),
        );
      }
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = useCallback(() => {
    setChatMessages([]);
    setComparisonMessages([]);
    setConversationId(null);
    setShowResults(false);
    setQuestion("");
    setCurrentRound(0);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedPhilosopher(null);
    setSelectedPhilosophers([]);
    setMode("compare");
    handleReset();
  }, [handleReset]);

  const selectedPhilosopherData = philosophers.filter((p) =>
    selectedPhilosophers.includes(p.id),
  );
  const philosopherImages: Record<string, string> = {};
  selectedPhilosopherData.forEach((p) => {
    if (p.imageUrl) philosopherImages[p.id] = p.imageUrl;
  });

  const content = selectedPhilosopher
    ? philosopherContent[selectedPhilosopher.id]
    : null;
  const suggestedPrompts = content?.suggestedPrompts?.slice(0, 3) || [];
  const followUpSuggestions = content?.followUpSuggestions
    ? content.followUpSuggestions(lastMessageTopic || suggestedPrompts[0] || "")
    : [];

  // If in single mode with a philosopher selected, show chat interface
  if (mode === "single" && selectedPhilosopher) {
    return (
      <>
        <main className="pt-16 pb-40 min-h-screen">
          {/* Philosopher header */}
          <div className="relative h-48 overflow-hidden">
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

            <div className="relative z-10 p-6 flex items-end gap-4 h-full">
              <button
                onClick={handleBack}
                className="mb-1 p-2 hover:bg-surface-container rounded-sm transition-colors"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <div className="w-20 h-20 rounded-sm overflow-hidden border-2 border-primary/30 shadow-lg flex-shrink-0">
                {selectedPhilosopher.imageUrl ? (
                  <img
                    src={selectedPhilosopher.imageUrl}
                    alt={selectedPhilosopher.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                    <span className="font-headline text-4xl text-zinc-600">
                      {selectedPhilosopher.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="font-label text-[10px] text-primary uppercase tracking-widest">
                    Active
                  </span>
                </div>
                <p className="font-headline text-2xl">
                  {selectedPhilosopher.name}
                </p>
                <p className="font-label text-[9px] text-zinc-400">
                  {selectedPhilosopher.era} · {selectedPhilosopher.tradition}
                </p>
              </div>
              <button
                onClick={() => setMode("compare")}
                className="px-3 py-2 bg-surface-container border border-outline-variant/30 rounded-sm font-label text-[10px] uppercase tracking-widest text-zinc-400 hover:text-primary hover:border-primary/30 transition-all mb-1"
              >
                Switch to Compare
              </button>
            </div>
          </div>

          {/* Context indicator */}
          {lastDiscussedMap[selectedPhilosopher.id] &&
            chatMessages.length === 0 && (
              <div className="px-6 py-2 border-b border-outline-variant/20 bg-surface-container/50">
                <div className="flex items-center gap-2 text-xs text-primary">
                  <span className="material-symbols-outlined text-sm">
                    auto_awesome
                  </span>
                  <span>
                    Resuming conversation about "
                    {lastDiscussedMap[selectedPhilosopher.id].topic}"
                  </span>
                </div>
              </div>
            )}

          {/* Chat Interface */}
          <div className="flex-1 min-h-0">
            <ChatInterface
              messages={chatMessages.map((m) => ({
                ...m,
                philosopherName:
                  m.timestamp && m.role === "assistant"
                    ? m.timestamp
                    : undefined,
              }))}
              onSendMessage={handleSendChatMessage}
              disabled={isLoading}
              philosopherName={selectedPhilosopher.name}
              philosopherBio={selectedPhilosopher.bio}
              showTypingIndicator={isLoading}
              mode="dialogue"
              suggestedPrompts={suggestedPrompts}
              followUpSuggestions={followUpSuggestions}
            />
          </div>
        </main>
      </>
    );
  }

  // Compare mode UI
  return (
    <>
      <main className="pt-16 pb-[120px] min-h-screen flex flex-col">
        {/* Mode Toggle & Header */}
        <section className="p-6 border-b border-outline-variant/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                psychology
              </span>
              <h2 className="font-headline text-lg uppercase tracking-widest">
                Arena
              </h2>
            </div>
            {/* Mode Toggle */}
            <div className="flex bg-surface-container rounded-sm p-1">
              <button
                onClick={() => setMode("single")}
                className={`px-4 py-2 rounded-sm font-label text-[10px] uppercase tracking-widest transition-all ${
                  mode === "single"
                    ? "bg-primary text-surface-container-lowest"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Single
              </button>
              <button
                onClick={() => setMode("compare")}
                className={`px-4 py-2 rounded-sm font-label text-[10px] uppercase tracking-widest transition-all ${
                  mode === "compare"
                    ? "bg-primary text-surface-container-lowest"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Compare
              </button>
            </div>
          </div>

          {loadingPhilosophers ? (
            <div className="flex items-center justify-center py-8">
              <LoadingDots />
            </div>
          ) : mode === "single" ? (
            /* Single Mode - Grid */
            <div>
              <p className="font-label text-[10px] text-zinc-500 uppercase tracking-widest mb-3">
                Select a Thinker
              </p>

              {/* Category Filters */}
              <div className="px-6 mb-4">
                <div className="flex gap-2 flex-wrap">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-sm font-label text-[10px] uppercase tracking-widest transition-all ${
                        activeCategory === cat.id
                          ? "bg-primary text-surface-container-lowest"
                          : "bg-surface-container text-zinc-400 hover:text-zinc-300"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-3 px-6">
                {philosophers
                  .filter((p) => {
                    if (
                      mode === "single" ||
                      selectedPhilosophers.length === 0 ||
                      selectedPhilosophers.includes(p.id)
                    ) {
                      if (activeCategory === "all") return true;
                      return categoryPhilosophers[activeCategory]?.includes(
                        p.id,
                      );
                    }
                    return false;
                  })
                  .map((philosopher) => {
                    const isSelected = selectedPhilosophers.includes(
                      philosopher.id,
                    );
                    return (
                      <button
                        key={philosopher.id}
                        onClick={() => handleSelectPhilosopher(philosopher)}
                        className={`rounded-sm overflow-hidden group cursor-pointer transition-all border-2 focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                          isSelected
                            ? "border-primary"
                            : "border-outline-variant/30 hover:border-primary/30"
                        }`}
                      >
                        <div className="h-64 relative">
                          {/* Grayscale base image */}
                          {philosopher.imageUrl ? (
                            <img
                              src={philosopher.imageUrl}
                              alt={philosopher.name}
                              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isSelected ? "opacity-0" : "grayscale opacity-60 group-hover:opacity-0"}`}
                            />
                          ) : (
                            <div className="absolute inset-0 w-full h-full bg-surface-container flex items-center justify-center">
                              <span className="font-headline text-4xl text-zinc-600">
                                {philosopher.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          {/* Color image on hover/selected */}
                          {philosopher.imageUrl &&
                            (() => {
                              const match =
                                philosopher.imageUrl.match(
                                  /^(.+\/)([^/]+)\.png$/,
                                );
                              return match ? (
                                <img
                                  src={`${match[1]}color/${match[2]}_c.png`}
                                  alt={philosopher.name}
                                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                                />
                              ) : (
                                <img
                                  src={philosopher.imageUrl}
                                  alt={philosopher.name}
                                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                                />
                              );
                            })()}
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                          <div className="absolute bottom-2 left-3">
                            <p className="font-headline text-sm tracking-tight">
                              {philosopher.name}
                            </p>
                            <p className="font-label text-[9px] text-zinc-500">
                              {philosopher.era}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          ) : (
            /* Compare Mode - Multi-select */
            <div>
              <p className="font-label text-[10px] text-zinc-500 uppercase tracking-widest mb-3">
                Select Thinkers (1+ for compare)
              </p>

              {/* Category Filters */}
              <div className="px-6 mb-4">
                <div className="flex gap-2 flex-wrap">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-sm font-label text-[10px] uppercase tracking-widest transition-all ${
                        activeCategory === cat.id
                          ? "bg-primary text-surface-container-lowest"
                          : "bg-surface-container text-zinc-400 hover:text-zinc-300"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-3 px-6">
                {philosophers
                  .filter((p) => {
                    if (activeCategory === "all") return true;
                    return categoryPhilosophers[activeCategory]?.includes(p.id);
                  })
                  .map((philosopher) => {
                    const isSelected = selectedPhilosophers.includes(
                      philosopher.id,
                    );
                    return (
                      <button
                        key={philosopher.id}
                        onClick={() => togglePhilosopher(philosopher.id)}
                        className={`rounded-sm overflow-hidden group cursor-pointer transition-all border-2 focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                          isSelected
                            ? "border-primary"
                            : "border-outline-variant/30 hover:border-primary/30"
                        }`}
                        aria-pressed={isSelected}
                      >
                        <div className="h-64 relative">
                          {/* Grayscale base image */}
                          {philosopher.imageUrl ? (
                            <img
                              src={philosopher.imageUrl}
                              alt={philosopher.name}
                              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isSelected ? "opacity-0" : "grayscale opacity-60 group-hover:opacity-0"}`}
                            />
                          ) : (
                            <div className="absolute inset-0 w-full h-full bg-surface-container flex items-center justify-center">
                              <span className="font-headline text-4xl text-zinc-600">
                                {philosopher.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          {/* Color image on hover/selected */}
                          {philosopher.imageUrl &&
                            (() => {
                              const match =
                                philosopher.imageUrl.match(
                                  /^(.+\/)([^/]+)\.png$/,
                                );
                              return match ? (
                                <img
                                  src={`${match[1]}color/${match[2]}_c.png`}
                                  alt={philosopher.name}
                                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                                />
                              ) : (
                                <img
                                  src={philosopher.imageUrl}
                                  alt={philosopher.name}
                                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                                />
                              );
                            })()}
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                          <div className="absolute bottom-2 left-3">
                            <p className="font-headline text-sm tracking-tight">
                              {philosopher.name}
                            </p>
                            <p className="font-label text-[9px] text-zinc-500">
                              {philosopher.era}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
              </div>
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
            </div>
          )}
        </section>

        {/* Question Input - Fixed at bottom */}
        <div className="fixed bottom-20 md:bottom-0 left-0 right-0 z-40 p-4 bg-gradient-to-r from-[#00aa66]/20 to-[#4477cc]/20 backdrop-blur-sm border-t border-outline-variant/20">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-secondary">
                help
              </span>
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
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) return;
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitQuestion();
                  }
                }}
                placeholder={
                  showResults
                    ? "Continue the conversation..."
                    : "What question would you like to explore?"
                }
                rows={1}
                className="flex-1 bg-surface-container border border-outline-variant/30 rounded-full px-6 py-3 text-on-surface placeholder:text-zinc-600 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors resize-none font-body text-sm min-h-[48px] max-h-[200px] overflow-y-auto"
              />
              <button
                onClick={handleSubmitQuestion}
                disabled={
                  !question.trim() ||
                  selectedPhilosophers.length === 0 ||
                  isLoading ||
                  isLoadingMessages
                }
                className={`w-12 h-12 rounded-full font-headline font-bold flex items-center justify-center transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                  question.trim() &&
                  selectedPhilosophers.length > 0 &&
                  !isLoading &&
                  !isLoadingMessages
                    ? "bg-primary text-surface-container-lowest hover:shadow-[0_0_20px_rgba(0,255,163,0.4)]"
                    : "bg-surface-container text-zinc-600 cursor-not-allowed"
                }`}
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {showResults && comparisonMessages.length > 0 && (
          <section className="p-6 border-t border-outline-variant/20 flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">
                  compare
                </span>
                <h2 className="font-headline text-lg uppercase tracking-widest">
                  {selectedPhilosophers.length > 1
                    ? "Comparative Responses"
                    : "Response"}
                </h2>
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-sm font-label text-[10px] uppercase tracking-widest bg-surface-container border border-outline-variant/30 hover:border-primary/50 text-zinc-400 hover:text-primary transition-all"
              >
                New Conversation
              </button>
            </div>
            <ComparisonView
              messages={comparisonMessages}
              question={question || "Continuing conversation..."}
              philosopherImages={philosopherImages}
            />

            {/* Follow-up suggestions */}
            {currentRound > 0 && (
              <div className="mt-6 p-4 bg-surface-container border border-outline-variant/10 rounded-sm">
                <p className="font-label text-[10px] text-secondary uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">
                    lightbulb
                  </span>
                  Follow-up Questions
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      setQuestion(
                        "Based on your earlier responses, how would you respond to the opposing view?",
                      )
                    }
                    className="px-3 py-2 bg-surface border border-outline-variant/20 rounded-sm text-xs text-zinc-400 hover:text-secondary hover:border-secondary/30 transition-all"
                  >
                    Challenge the opposing view?
                  </button>
                  <button
                    onClick={() =>
                      setQuestion(
                        "Can you provide an example from contemporary life that illustrates your position?",
                      )
                    }
                    className="px-3 py-2 bg-surface border border-outline-variant/20 rounded-sm text-xs text-zinc-400 hover:text-secondary hover:border-secondary/30 transition-all"
                  >
                    Modern example?
                  </button>
                  <button
                    onClick={() =>
                      setQuestion(
                        "What would you say to someone who disagrees with your fundamental premise?",
                      )
                    }
                    className="px-3 py-2 bg-surface border border-outline-variant/20 rounded-sm text-xs text-zinc-400 hover:text-secondary hover:border-secondary/30 transition-all"
                  >
                    Address objections?
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Loading State */}
        {isLoading && (
          <section className="p-6 border-t border-outline-variant/20">
            <div className="bg-surface-container border border-outline-variant/20 rounded-sm p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <LoadingDots size="lg" />
              </div>
              <p className="font-headline text-lg uppercase tracking-widest text-zinc-400">
                Thinkers Are Deliberating...
              </p>
            </div>
          </section>
        )}

        {/* Empty State */}
        {!showResults && !isLoading && (
          <section className="flex-1 p-6 flex items-center justify-center">
            <div className="text-center">
              <span className="material-symbols-outlined text-6xl text-zinc-600 mb-4 block">
                psychology
              </span>
              <h3 className="font-headline text-xl text-zinc-400 mb-2">
                The Arena Awaits
              </h3>
              <p className="text-on-surface-variant text-sm max-w-md mx-auto mb-6">
                {mode === "single"
                  ? "Select a thinker to begin a dialogue."
                  : "Select thinkers and pose a question to see their perspectives."}
              </p>
              <div className="flex flex-col gap-2 items-center">
                <p className="font-label text-[10px] text-primary uppercase tracking-widest mb-3">
                  Philosophical Questions
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    "What role should emotion play in decisions?",
                    "Is consciousness fundamental or emergent?",
                    "What is the nature of time?",
                    "Can we have free will in a deterministic universe?",
                    "What constitutes personal identity over time?",
                  ].map((q, i) => (
                    <button
                      key={`phil-${i}`}
                      onClick={() => {
                        if (selectedPhilosophers.length > 0) {
                          setQuestion(q);
                        }
                      }}
                      disabled={selectedPhilosophers.length === 0}
                      className={`px-3 py-2 bg-surface-container border border-outline-variant/30 rounded-sm text-xs transition-all ${
                        selectedPhilosophers.length > 0
                          ? "text-zinc-400 hover:text-primary hover:border-primary/30"
                          : "text-zinc-600 cursor-not-allowed"
                      }`}
                    >
                      {q.length > 35 ? q.slice(0, 35) + "..." : q}
                    </button>
                  ))}
                </div>
                <div className="w-full border-t border-outline-variant/30 my-4" />
                <p className="font-label text-[10px] text-secondary uppercase tracking-widest mb-3">
                  Finance &amp; Risk
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    "What drives market cycles and regime changes?",
                    "How do narratives shape financial decisions?",
                    "How should we position for inflation or deflation?",
                    "What is the role of liquidity in portfolio construction?",
                    "How do we think about tail risk and black swan events?",
                    "What is the relationship between leverage and fragility?",
                    "How should we think about correlation across assets?",
                    "What drives currency movements and geopolitical shifts?",
                    "How do we identify bubbles before they burst?",
                    "What is the role of central bank policy in markets?",
                  ].map((q, i) => (
                    <button
                      key={`fin-${i}`}
                      onClick={() => {
                        if (selectedPhilosophers.length > 0) {
                          setQuestion(q);
                        }
                      }}
                      disabled={selectedPhilosophers.length === 0}
                      className={`px-3 py-2 bg-surface-container border border-outline-variant/30 rounded-sm text-xs transition-all ${
                        selectedPhilosophers.length > 0
                          ? "text-zinc-400 hover:text-secondary hover:border-secondary/30"
                          : "text-zinc-600 cursor-not-allowed"
                      }`}
                    >
                      {q.length > 35 ? q.slice(0, 35) + "..." : q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

export default function ArenaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface flex items-center justify-center">
          <LoadingDots />
        </div>
      }
    >
      <ArenaContent />
    </Suspense>
  );
}
