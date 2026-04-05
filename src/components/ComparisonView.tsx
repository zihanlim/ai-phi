"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface ComparisonMessage {
  id: string;
  philosopherId: string;
  philosopherName: string;
  content: string;
  round?: number;
}

interface ComparisonViewProps {
  messages: ComparisonMessage[];
  question: string;
  philosopherImages?: Record<string, string>;
}

export function ComparisonView({ messages, question, philosopherImages = {} }: ComparisonViewProps) {
  const [highlightedPhilosopher, setHighlightedPhilosopher] = useState<string | null>(null);
  const [expandedRounds, setExpandedRounds] = useState<Set<number>>(new Set());
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Auto-expand all rounds
  useEffect(() => {
    const rounds = new Set<number>();
    messages.forEach((m) => {
      if (m.round !== undefined) rounds.add(m.round);
    });
    setExpandedRounds(rounds);
  }, [messages]);

  // Group messages by round
  const messagesByRound = messages.reduce((acc, msg) => {
    const round = msg.round ?? 0;
    if (!acc[round]) acc[round] = [];
    acc[round].push(msg);
    return acc;
  }, {} as Record<number, ComparisonMessage[]>);

  const toggleRound = (round: number) => {
    setExpandedRounds((prev) => {
      const next = new Set(prev);
      if (next.has(round)) {
        next.delete(round);
      } else {
        next.add(round);
      }
      return next;
    });
  };

  const handleImageError = (philosopherId: string) => {
    setImageErrors((prev) => new Set(prev).add(philosopherId));
  };

  const hasImage = (philosopherId: string) => {
    return philosopherImages[philosopherId] && !imageErrors.has(philosopherId);
  };

  return (
    <div className="flex flex-col">
      {question && (
        <div className="mb-4">
          <p className="text-sm text-on-surface-variant mb-1">Question posed to all:</p>
          <p className="font-medium text-on-surface">{question}</p>
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(messagesByRound).map(([roundStr, roundMessages]) => {
          const round = parseInt(roundStr);
          const isExpanded = expandedRounds.has(round);

          return (
            <div key={roundStr}>
              {/* Round Header */}
              <button
                onClick={() => toggleRound(round)}
                className="flex items-center gap-2 mb-3 w-full text-left"
              >
                <span className={`material-symbols-outlined text-sm transition-transform ${isExpanded ? "rotate-90" : ""}`}>
                  chevron_right
                </span>
                <span className="font-label text-[10px] uppercase tracking-widest text-secondary">
                  {round === 0 ? "Initial Question" : `Round ${round}`}
                </span>
              </button>

              {/* Messages Grid */}
              {isExpanded && (
                <div className={`grid gap-4 ${
                  roundMessages.length === 1
                    ? 'grid-cols-1'
                    : roundMessages.length === 2
                    ? 'grid-cols-1 lg:grid-cols-2'
                    : roundMessages.length === 3
                    ? 'grid-cols-1 md:grid-cols-3'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                }`}>
                  {roundMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`rounded-2xl p-4 transition-all ${
                        highlightedPhilosopher === message.philosopherId
                          ? "bg-surface-container-low ring-2 ring-primary"
                          : "bg-surface-variant"
                      }`}
                      onMouseEnter={() => setHighlightedPhilosopher(message.philosopherId)}
                      onMouseLeave={() => setHighlightedPhilosopher(null)}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        {hasImage(message.philosopherId) ? (
                          <div className="w-12 h-12 rounded-full bg-surface flex-shrink-0 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={philosopherImages[message.philosopherId]}
                              alt={message.philosopherName}
                              className="w-full h-full object-cover"
                              onError={() => handleImageError(message.philosopherId)}
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                            <span className="font-display text-primary text-lg">
                              {message.philosopherName.charAt(0)}
                            </span>
                          </div>
                        )}
                        <h3 className="font-display text-on-surface">
                          {message.philosopherName}
                        </h3>
                      </div>
                      <div className="text-on-surface-variant prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {messages.length === 0 && (
          <div className="text-center py-12 text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl mb-2 block">
              compare
            </span>
            <p>Pose a question to see philosophers&apos; perspectives side by side</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-outline-variant">
        <p className="text-xs text-on-surface-variant text-center">
          Click round headers to collapse/expand · Hover over a response to highlight
        </p>
      </div>
    </div>
  );
}
