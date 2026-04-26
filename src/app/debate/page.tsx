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

// Module-level variable to persist across component re-mounts
let moduleConversationId: string | null = null;
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
  question?: string;
}

function DebateContent() {
  const searchParams = useSearchParams();
  const [philosophers, setPhilosophers] = useState<Philosopher[]>([]);
  const [selectedPhilosophers, setSelectedPhilosophers] = useState<string[]>(
    [],
  );
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ComparisonMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [loadingPhilosophers, setLoadingPhilosophers] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [lastMessageTopic, setLastMessageTopic] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isLoadingMessagesRef = useRef(false);
  const loadingConvIdRef = useRef<string | null>(null);

  const autoGrow = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, []);

  // Handle pre-selected philosopher from query param and load conversation history
  useEffect(() => {
    // Get ALL philosopher IDs from query params (archive passes multiple)
    const philosopherIdsFromUrl: string[] = [];
    searchParams.forEach((value, key) => {
      if (key === "philosopher") {
        philosopherIdsFromUrl.push(value);
      }
    });

    if (philosopherIdsFromUrl.length > 0) {
      // Set all selected philosophers from URL
      setSelectedPhilosophers(philosopherIdsFromUrl);

      const primaryPhilosopherId = philosopherIdsFromUrl[0];

      // Function to load conversation with given philosophers list
      const loadWithPhilosophers = (phils: Philosopher[]) => {
        // Check for existing conversation in localStorage
        const convMapStored = localStorage.getItem(
          "ai-phi-philosopher-conversations",
        );
        let existingConvId: string | null = null;

        if (convMapStored) {
          try {
            const convMap = JSON.parse(convMapStored);
            existingConvId = convMap[primaryPhilosopherId] || null;
          } catch (e) {
            console.error("Failed to parse conversation map:", e);
          }
        }

        // Helper to load conversation with given ID
        const doLoadConversation = (
          convId: string,
          allPhilosopherIds: string[],
        ) => {
          loadConversationMessages(convId, allPhilosopherIds, phils);
        };

        if (existingConvId) {
          // First get the full conversation to get all philosopher IDs
          fetch(
            `/api/conversations?userId=null&conversationId=${existingConvId}`,
          )
            .then((res) => (res.ok ? res.json() : null))
            .then(
              (convData: { philosopherIds?: string[]; id?: string } | null) => {
                // API returns a single conversation object, not an array
                if (convData && convData.philosopherIds && existingConvId) {
                  setSelectedPhilosophers(convData.philosopherIds);
                  doLoadConversation(existingConvId, convData.philosopherIds);
                } else if (existingConvId) {
                  doLoadConversation(existingConvId, philosopherIdsFromUrl);
                }
              },
            )
            .catch(() => {
              if (existingConvId) {
                doLoadConversation(existingConvId, philosopherIdsFromUrl);
              }
            });
        } else {
          // Check with backend API - find conversation that has ALL these philosophers
          fetch(`/api/conversations?userId=null`)
            .then((res) => (res.ok ? res.json() : []))
            .then((allConvs: { philosopherIds?: string[]; id?: string }[]) => {
              // Find a conversation that includes ALL the selected philosophers
              const matchingConv = allConvs.find((c) => {
                const convPhilosopherIds = c.philosopherIds;
                return (
                  convPhilosopherIds &&
                  philosopherIdsFromUrl.every((pid: string) =>
                    convPhilosopherIds.includes(pid),
                  )
                );
              });
              if (matchingConv && matchingConv.id) {
                existingConvId = matchingConv.id;
                const newConvMap = convMapStored
                  ? JSON.parse(convMapStored)
                  : {};
                newConvMap[primaryPhilosopherId] = existingConvId;
                localStorage.setItem(
                  "ai-phi-philosopher-conversations",
                  JSON.stringify(newConvMap),
                );
                if (matchingConv.philosopherIds) {
                  setSelectedPhilosophers(matchingConv.philosopherIds);
                }
                doLoadConversation(
                  existingConvId,
                  matchingConv.philosopherIds || philosopherIdsFromUrl,
                );
              }
            })
            .catch((e) =>
              console.error("Failed to fetch conversation from API:", e),
            );
        }
      };

      // If philosophers are already loaded, use them directly
      if (philosophers.length > 0) {
        loadWithPhilosophers(philosophers);
      } else {
        // Fetch philosophers first, then load conversation
        fetch("/api/philosophers")
          .then((res) => (res.ok ? res.json() : []))
          .then((phils: Philosopher[]) => {
            setPhilosophers(phils);
            loadWithPhilosophers(phils);
          })
          .catch((e) => console.error("Failed to fetch philosophers:", e));
      }
    }
    setLoadingPhilosophers(false);
  }, [searchParams, philosophers.length]);

  const loadConversationMessages = async (
    convId: string,
    philosopherIds: string[],
    availablePhilosophers?: Philosopher[],
  ) => {
    // Prevent concurrent loading

    isLoadingMessagesRef.current = true;
    loadingConvIdRef.current = convId;
    setIsLoadingMessages(true);
    try {
      // First fetch the conversation to get the actual philosopher participants
      const convRes = await fetch(
        `/api/conversations?userId=null&conversationId=${convId}`,
      );
      let actualPhilosopherIds = philosopherIds;

      if (convRes.ok) {
        const convData = await convRes.json();
        if (convData && convData.philosopherIds) {
          actualPhilosopherIds = convData.philosopherIds;
        }
      }

      const msgRes = await fetch(`/api/chat?conversationId=${convId}`);
      if (msgRes.ok) {
        const existingMessages = await msgRes.json();

        // Transform messages to ComparisonMessage format
        // Group messages by round based on their order
        const transformedMessages: ComparisonMessage[] = [];
        let currentRoundMsgs: {
          philosopherId: string;
          philosopherName: string;
          content: string;
        }[] = [];

        // Use provided philosophers or fall back to state
        const philList = availablePhilosophers || philosophers;

        // Track current round number and the question for each round
        let currentRound = 0;
        let lastUserQuestion = "";

        existingMessages.forEach(
          (
            m: {
              role: string;
              content: string;
              philosopherId?: string;
              philosopherName?: string;
            },
            idx: number,
          ) => {
            if (m.role === "user") {
              // User message becomes the question for this round
              lastUserQuestion = m.content;
              setQuestion(m.content);
              setLastMessageTopic(m.content);
            } else if (m.role === "assistant") {
              // Use stored philosopherId if available, otherwise use round-robin
              let philosopherId = m.philosopherId;
              if (!philosopherId) {
                // Fallback to round-robin based on actual philosophers in conversation
                philosopherId =
                  actualPhilosopherIds[
                    currentRoundMsgs.length % actualPhilosopherIds.length
                  ];
              }
              const philosopherName =
                m.philosopherName ||
                philList.find((p) => p.id === philosopherId)?.name ||
                "Philosopher";

              currentRoundMsgs.push({
                philosopherId,
                philosopherName,
                content: m.content,
              });

              // If we have messages from multiple philosophers in this round, finalize the round
              if (currentRoundMsgs.length === actualPhilosopherIds.length) {
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
                // Increment round counter after finalizing
                currentRound++;
              }
            }
          },
        );

        // If there are remaining messages (incomplete round), add them
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
          setMessages(transformedMessages);
          setShowResults(true);
          setSelectedPhilosophers(actualPhilosopherIds);
          setConversationId(convId);
          conversationIdRef.current = convId;
          moduleConversationId = convId; // Persist in module variable
          setCurrentRound(currentRound);
        }
      }
    } catch (e) {
      console.error("Failed to load messages:", e);
    } finally {
      setIsLoadingMessages(false);
      isLoadingMessagesRef.current = false;
    }
  };

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
    const currentQuestion = question;

    try {
      const provider = localStorage.getItem("ai-phi-ai-provider") || "openai";
      const currentConvId = conversationIdRef.current ?? moduleConversationId;

      // Validate we have a conversation ID before making API call
      if (!currentConvId) {
        console.error("No conversation ID available for follow-up question");
      }

      const requestBody = {
        conversationId: currentConvId,
        philosopherIds: selectedPhilosophers,
        message: question,
        provider,
      };

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (res.ok) {
        const data = await res.json();

        if (!data.results || !Array.isArray(data.results)) {
          console.error("Invalid API response: missing results array", data);
          // Show error message for all philosophers
          const errorMessages: ComparisonMessage[] = selectedPhilosophers.map(
            (id, idx) => {
              const philosopher = philosophers.find((p) => p.id === id);
              return {
                id: `error-${Date.now()}-${idx}`,
                philosopherId: id,
                philosopherName: philosopher?.name || "Unknown",
                content: "Invalid response from server. Please try again.",
                round,
                question: currentQuestion,
              };
            },
          );
          setMessages((prev) => [...prev, ...errorMessages]);
          setIsLoading(false);
          return;
        }
        if (data.conversationId) {
          const newConvId = data.conversationId;
          setConversationId(newConvId);
          conversationIdRef.current = newConvId;
          moduleConversationId = newConvId; // Persist in module variable

          // Update localStorage mapping for each philosopher
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

          // Update conversation history
          const historyStored = localStorage.getItem(
            "ai-phi-conversation-history",
          );
          const newHistory = historyStored ? JSON.parse(historyStored) : {};
          selectedPhilosophers.forEach((pId) => {
            newHistory[pId] = {
              topic: question.trim().slice(0, 50),
              date: new Date().toISOString(),
            };
          });
          localStorage.setItem(
            "ai-phi-conversation-history",
            JSON.stringify(newHistory),
          );
        }
        // Transform API response to ComparisonMessage format with round
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

        // Check if any philosophers had errors
        const errorResults = data.results.filter(
          (r: { error: string | null }) => r.error,
        );
        if (errorResults.length > 0) {
          console.error("Some philosophers failed:", errorResults);
        }

        if (newMessages.length === 0) {
          // All philosophers failed
          const failMessages: ComparisonMessage[] = selectedPhilosophers.map(
            (id, idx) => {
              const philosopher = philosophers.find((p) => p.id === id);
              const errorInfo = errorResults.find(
                (e: { philosopherId: string }) => e.philosopherId === id,
              );
              return {
                id: `fail-${Date.now()}-${idx}`,
                philosopherId: id,
                philosopherName: philosopher?.name || "Unknown",
                content: errorInfo
                  ? `Error: ${errorInfo.error}`
                  : "No response received",
                round,
                question: currentQuestion,
              };
            },
          );
          setMessages((prev) => [...prev, ...failMessages]);
          setCurrentRound(round + 1);
        } else {
          // Append new messages to existing ones
          setMessages((prev) => [...prev, ...newMessages]);
          setCurrentRound(round + 1);
        }
      } else {
        // Fallback error message
        const errorMessages: ComparisonMessage[] = selectedPhilosophers.map(
          (id, idx) => {
            const philosopher = philosophers.find((p) => p.id === id);
            return {
              id: `error-${Date.now()}-${idx}`,
              philosopherId: id,
              philosopherName: philosopher?.name || "Unknown",
              content: "Unable to retrieve response. Please try again.",
              round,
              question: currentQuestion,
            };
          },
        );
        setMessages((prev) => [...prev, ...errorMessages]);
      }
    } catch (error) {
      console.error("Failed to submit question:", error);
      const errorMessages: ComparisonMessage[] = selectedPhilosophers.map(
        (id, idx) => {
          const philosopher = philosophers.find((p) => p.id === id);
          return {
            id: `error-${Date.now()}-${idx}`,
            philosopherId: id,
            philosopherName: philosopher?.name || "Unknown",
            content:
              "Network error. Please check your connection and try again.",
            round,
            question: currentQuestion,
          };
        },
      );
      setMessages((prev) => [...prev, ...errorMessages]);
    } finally {
      setIsLoading(false);
      setQuestion("");
    }
  };

  const selectedPhilosopherData = philosophers.filter((p) =>
    selectedPhilosophers.includes(p.id),
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
      <main className="pt-16 pb-[120px] min-h-screen flex flex-col">
        {/* Philosopher Selection Section */}
        <section className="p-6 border-b border-outline-variant/20">
          <div className="flex items-center gap-2 mb-4">
            <span
              className="material-symbols-outlined text-primary"
              aria-hidden="true"
            >
              groups
            </span>
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
                const isSelected = selectedPhilosophers.includes(
                  philosopher.id,
                );
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
                        <img
                          src={philosopher.imageUrl}
                          alt={philosopher.name}
                          className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 transition-opacity"
                        />
                      ) : (
                        <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                          <span
                            className="font-headline text-3xl text-zinc-600"
                            aria-hidden="true"
                          >
                            {philosopher.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                    <div className="p-2 text-center">
                      <p
                        className={`font-label text-[9px] uppercase tracking-widest truncate ${isSelected ? "text-primary" : "text-zinc-400"}`}
                      >
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

        {/* Context indicator for resumed conversations */}
        {lastMessageTopic && showResults && (
          <div className="px-6 py-2 border-b border-outline-variant/20 bg-surface-container/50">
            <div className="flex items-center gap-2 text-xs text-secondary">
              <span className="material-symbols-outlined text-sm">
                auto_awesome
              </span>
              <span>Resuming debate about "{lastMessageTopic}"</span>
            </div>
          </div>
        )}

        {/* Question Input Section - stays visible for follow-up questions */}
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
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    return;
                  }
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitQuestion();
                  }
                }}
                placeholder={
                  showResults
                    ? "Continue the debate..."
                    : "What philosophical question would you like to pose?"
                }
                rows={1}
                className="flex-1 bg-surface-container border border-outline-variant/30 rounded-full px-6 py-3 text-on-surface placeholder:text-zinc-600 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors resize-none font-body text-sm min-h-[48px] max-h-[200px] overflow-y-auto"
                aria-label="Debate question input"
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
                aria-label={showResults ? "Continue debate" : "Pose question"}
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  send
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {showResults && (messages.length > 0 || isLoading) && (
          <section className="p-6 border-t border-outline-variant/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">
                  compare
                </span>
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
              <ComparisonView
                messages={messages}
                question={question || "Continuing conversation..."}
                philosopherImages={philosopherImages}
              />
            </div>

            {/* Follow-up Suggestions - only show after first round */}
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
                  <button
                    onClick={() =>
                      setQuestion(
                        "What are the practical implications of your philosophical position?",
                      )
                    }
                    className="px-3 py-2 bg-surface border border-outline-variant/20 rounded-sm text-xs text-zinc-400 hover:text-secondary hover:border-secondary/30 transition-all"
                  >
                    Practical implications?
                  </button>
                </div>
              </div>
            )}

            {/* Loading State - shown after the current responses */}
            {isLoading && (
              <div
                className="mt-6 bg-surface-container border border-outline-variant/20 rounded-sm p-8 text-center"
                aria-live="polite"
                aria-label="Loading"
              >
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
            )}
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
              <p className="text-on-surface-variant text-sm max-w-md mx-auto mb-6 text-center">
                Select at least one philosopher and pose a question to see their
                perspectives compared side by side.
              </p>
              <div className="flex flex-col gap-2 items-center">
                <p className="font-label text-[10px] text-primary uppercase tracking-widest mb-3">
                  Philosophical Questions
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() =>
                      setQuestion("What role should emotion play in decisions?")
                    }
                    className="px-3 py-2 bg-surface-container border border-outline-variant/30 rounded-sm text-xs text-zinc-400 hover:text-primary hover:border-primary/30 transition-all"
                  >
                    Emotion in decisions
                  </button>
                  <button
                    onClick={() =>
                      setQuestion("Is consciousness fundamental or emergent?")
                    }
                    className="px-3 py-2 bg-surface-container border border-outline-variant/30 rounded-sm text-xs text-zinc-400 hover:text-primary hover:border-primary/30 transition-all"
                  >
                    Consciousness
                  </button>
                  <button
                    onClick={() =>
                      setQuestion("What is the nature of time?")
                    }
                    className="px-3 py-2 bg-surface-container border border-outline-variant/30 rounded-sm text-xs text-zinc-400 hover:text-primary hover:border-primary/30 transition-all"
                  >
                    Nature of time
                  </button>
                  <button
                    onClick={() =>
                      setQuestion("Can we have free will in a deterministic universe?")
                    }
                    className="px-3 py-2 bg-surface-container border border-outline-variant/30 rounded-sm text-xs text-zinc-400 hover:text-primary hover:border-primary/30 transition-all"
                  >
                    Free will vs determinism
                  </button>
                  <button
                    onClick={() =>
                      setQuestion("What constitutes personal identity over time?")
                    }
                    className="px-3 py-2 bg-surface-container border border-outline-variant/30 rounded-sm text-xs text-zinc-400 hover:text-primary hover:border-primary/30 transition-all"
                  >
                    Personal identity
                  </button>
                </div>
                <div className="w-full border-t border-outline-variant/30 my-4" />
                <p className="font-label text-[10px] text-secondary uppercase tracking-widest mb-3">
                  Finance &amp; Risk
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() =>
                      setQuestion("What drives market cycles and regime changes?")
                    }
                    className="px-3 py-2 bg-surface-container border border-outline-variant/30 rounded-sm text-xs text-zinc-400 hover:text-secondary hover:border-secondary/30 transition-all"
                  >
                    Market cycles
                  </button>
                  <button
                    onClick={() =>
                      setQuestion("How do narratives shape financial decisions?")
                    }
                    className="px-3 py-2 bg-surface-container border border-outline-variant/30 rounded-sm text-xs text-zinc-400 hover:text-secondary hover:border-secondary/30 transition-all"
                  >
                    Narratives in finance
                  </button>
                  <button
                    onClick={() =>
                      setQuestion("How should we position for inflation or deflation?")
                    }
                    className="px-3 py-2 bg-surface-container border border-outline-variant/30 rounded-sm text-xs text-zinc-400 hover:text-secondary hover:border-secondary/30 transition-all"
                  >
                    Inflation vs deflation
                  </button>
                  <button
                    onClick={() =>
                      setQuestion("What is the role of liquidity in portfolio construction?")
                    }
                    className="px-3 py-2 bg-surface-container border border-outline-variant/30 rounded-sm text-xs text-zinc-400 hover:text-secondary hover:border-secondary/30 transition-all"
                  >
                    Liquidity in portfolios
                  </button>
                  <button
                    onClick={() =>
                      setQuestion("How do we think about tail risk and black swan events?")
                    }
                    className="px-3 py-2 bg-surface-container border border-outline-variant/30 rounded-sm text-xs text-zinc-400 hover:text-secondary hover:border-secondary/30 transition-all"
                  >
                    Tail risk & black swans
                  </button>
                  <button
                    onClick={() =>
                      setQuestion("What is the relationship between leverage and fragility?")
                    }
                    className="px-3 py-2 bg-surface-container border border-outline-variant/30 rounded-sm text-xs text-zinc-400 hover:text-secondary hover:border-secondary/30 transition-all"
                  >
                    Leverage & fragility
                  </button>
                  <button
                    onClick={() =>
                      setQuestion("How should we think about correlation across assets?")
                    }
                    className="px-3 py-2 bg-surface-container border border-outline-variant/30 rounded-sm text-xs text-zinc-400 hover:text-secondary hover:border-secondary/30 transition-all"
                  >
                    Asset correlation
                  </button>
                  <button
                    onClick={() =>
                      setQuestion("What drives currency movements and geopolitical shifts?")
                    }
                    className="px-3 py-2 bg-surface-container border border-outline-variant/30 rounded-sm text-xs text-zinc-400 hover:text-secondary hover:border-secondary/30 transition-all"
                  >
                    Currency & geopolitics
                  </button>
                  <button
                    onClick={() =>
                      setQuestion("How do we identify bubbles before they burst?")
                    }
                    className="px-3 py-2 bg-surface-container border border-outline-variant/30 rounded-sm text-xs text-zinc-400 hover:text-secondary hover:border-secondary/30 transition-all"
                  >
                    Identifying bubbles
                  </button>
                  <button
                    onClick={() =>
                      setQuestion("What is the role of central bank policy in markets?")
                    }
                    className="px-3 py-2 bg-surface-container border border-outline-variant/30 rounded-sm text-xs text-zinc-400 hover:text-secondary hover:border-secondary/30 transition-all"
                  >
                    Central bank policy
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
