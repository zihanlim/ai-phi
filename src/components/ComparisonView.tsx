"use client";

import { useState } from "react";

interface ComparisonMessage {
  id: string;
  philosopherId: string;
  philosopherName: string;
  content: string;
}

interface ComparisonViewProps {
  messages: ComparisonMessage[];
  question: string;
}

export function ComparisonView({ messages, question }: ComparisonViewProps) {
  const [highlightedPhilosopher, setHighlightedPhilosopher] = useState<string | null>(null);

  return (
    <div className="h-full flex flex-col">
      {question && (
        <div className="p-4 border-b border-outline-variant bg-surface-container-low">
          <p className="text-sm text-on-surface-variant mb-1">Question posed to all:</p>
          <p className="font-medium text-on-surface">{question}</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {messages.map((message) => (
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
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="font-display text-primary">
                    {message.philosopherName.charAt(0)}
                  </span>
                </div>
                <h3 className="font-display text-on-surface">
                  {message.philosopherName}
                </h3>
              </div>
              <p className="text-on-surface-variant whitespace-pre-wrap">
                {message.content}
              </p>
            </div>
          ))}
        </div>

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
          Hover over a response to highlight it · Compare perspectives on ideas
        </p>
      </div>
    </div>
  );
}
