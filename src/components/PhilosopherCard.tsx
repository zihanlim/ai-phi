"use client";

import { useState } from "react";

interface Philosopher {
  id: string;
  name: string;
  era: string;
  tradition: string;
  bio: string;
  works: string[];
  ideas: string[];
  imageUrl?: string;
  conversationCount?: number;
  lastDiscussed?: string;
  lastDiscussedAt?: string;
  personalityTags?: string[];
}

interface PhilosopherCardProps {
  philosopher: Philosopher;
  selected?: boolean;
  onSelect?: (philosopher: Philosopher) => void;
  compact?: boolean;
}

export function PhilosopherCard({
  philosopher,
  selected = false,
  onSelect,
  compact = false,
}: PhilosopherCardProps) {
  const [imageError, setImageError] = useState(false);

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "today";
    if (diffDays === 1) return "yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const cardContent = (
    <article
      className={`relative rounded-2xl overflow-hidden transition-all cursor-pointer ${
        selected
          ? "ring-2 ring-primary bg-surface-container-low"
          : "bg-surface-variant hover:bg-surface-container-highest"
      } ${compact ? "p-3" : "p-4"}`}
      onClick={() => onSelect?.(philosopher)}
    >
      <div className="flex gap-4">
        {!compact && (
          <div className="w-16 h-16 rounded-full bg-surface flex-shrink-0 overflow-hidden">
            {philosopher.imageUrl && !imageError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={philosopher.imageUrl}
                alt={philosopher.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-display text-on-surface-variant">
                {philosopher.name.charAt(0)}
              </div>
            )}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-on-surface truncate">
              {philosopher.name}
            </h3>
            {philosopher.conversationCount !== undefined && philosopher.conversationCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface text-zinc-500 flex-shrink-0">
                {philosopher.conversationCount >= 1000 
                  ? `${(philosopher.conversationCount / 1000).toFixed(1)}K` 
                  : philosopher.conversationCount} dialogues
              </span>
            )}
          </div>
          <p className="text-sm text-on-surface-variant">
            {philosopher.era} · {philosopher.tradition}
          </p>
          
          {philosopher.lastDiscussed && (
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-primary/70">
              <span className="material-symbols-outlined text-xs">history</span>
              <span className="truncate max-w-[180px]">
                Last: {philosopher.lastDiscussed}
                {philosopher.lastDiscussedAt && ` · ${formatTimeAgo(philosopher.lastDiscussedAt)}`}
              </span>
            </div>
          )}
          
          {!compact && (
            <p className="mt-2 text-sm text-on-surface-variant line-clamp-2">
              {philosopher.bio}
            </p>
          )}
          
          {!compact && philosopher.personalityTags && philosopher.personalityTags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {philosopher.personalityTags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 text-[10px] rounded-full bg-surface text-primary border border-primary/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {!compact && philosopher.ideas.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {philosopher.ideas.slice(0, 3).map((idea, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 text-xs rounded-full bg-surface text-on-surface-variant"
                >
                  {idea}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {selected && (
        <span className="absolute top-2 right-2 material-symbols-outlined text-primary text-xl">
          check_circle
        </span>
      )}
    </article>
  );

  return cardContent;
}
