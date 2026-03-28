"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";

interface Conversation {
  id: string;
  title: string;
  philosopherIds: string[];
  philosopherNames: string[];
  lastMessage: string;
  updatedAt: string;
  type: "dialogue" | "debate";
}

export default function ArchivePage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchConversations() {
      try {
        const res = await fetch("/api/conversations?userId=anonymous");
        if (res.ok) {
          const data = await res.json();
          setConversations(data);
        }
      } catch {
        console.error("Failed to fetch conversations");
      } finally {
        setLoading(false);
      }
    }
    fetchConversations();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-[#09090b] border-b border-[#27272a] flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-primary active:scale-95 transition-transform cursor-pointer">
            menu
          </span>
          <h1 className="text-2xl font-headline font-bold tracking-widest text-primary uppercase">
            DIGITAL AGORA
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-label text-[10px] text-zinc-500 uppercase tracking-widest hidden md:block">
            Archive
          </span>
          <span className="material-symbols-outlined text-zinc-400 hover:text-primary transition-colors duration-200 cursor-pointer">
            notifications
          </span>
        </div>
      </header>

      <main className="pt-16 pb-32 min-h-screen">
        <section className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-primary text-2xl">history_edu</span>
            <h2 className="font-headline text-3xl uppercase tracking-widest">
              Conversation Archive
            </h2>
          </div>

          {loading ? (
            <div className="flex gap-1 items-center justify-center h-64">
              <span className="font-label text-primary text-xl blinking-cursor">_</span>
              <span className="font-label text-primary text-xl opacity-40">_</span>
              <span className="font-label text-primary text-xl opacity-20">_</span>
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-6xl text-zinc-600 mb-6 block">
                folder_open
              </span>
              <h3 className="font-headline text-2xl text-zinc-400 mb-3">
                No Saved Conversations
              </h3>
              <p className="text-on-surface-variant max-w-md mx-auto mb-8">
                Your dialogues and debates will be saved here for future reference.
                Start a conversation with a philosopher to build your archive.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-surface-container-lowest rounded-sm font-headline font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,255,163,0.4)] transition-all"
              >
                <span className="material-symbols-outlined">home</span>
                Return to Hub
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="bg-surface-container border border-outline-variant/10 rounded-sm overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleExpand(conversation.id)}
                    className="w-full p-6 flex items-center justify-between text-left hover:bg-surface-container-high transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`px-2 py-1 text-[10px] font-label uppercase tracking-widest rounded-sm ${
                            conversation.type === "debate"
                              ? "bg-secondary/20 text-secondary border border-secondary/30"
                              : "bg-primary/20 text-primary border border-primary/30"
                          }`}
                        >
                          {conversation.type === "debate" ? "Debate" : "Dialogue"}
                        </span>
                        <span className="font-label text-[10px] text-zinc-500">
                          {formatDate(conversation.updatedAt)}
                        </span>
                      </div>
                      <h3 className="font-headline text-xl text-on-surface mb-2">
                        {conversation.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-label text-[10px] text-zinc-500 uppercase tracking-widest">
                          Participants:
                        </span>
                        {conversation.philosopherNames.map((name, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-surface-container-high text-zinc-400 text-[10px] font-label"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                      <p className="text-on-surface-variant text-sm line-clamp-1">
                        {conversation.lastMessage}
                      </p>
                    </div>
                    <span
                      className={`material-symbols-outlined text-zinc-500 transition-transform ml-4 ${
                        expandedId === conversation.id ? "rotate-180" : ""
                      }`}
                    >
                      expand_more
                    </span>
                  </button>

                  {expandedId === conversation.id && (
                    <div className="px-6 pb-6 border-t border-outline-variant/10 pt-4">
                      <div className="bg-surface-container-low p-4 rounded-sm mb-4">
                        <p className="font-label text-[10px] text-zinc-500 uppercase tracking-widest mb-2">
                          Last Message
                        </p>
                        <p className="text-on-surface-variant">
                          {conversation.lastMessage}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <Link
                          href={
                            conversation.type === "debate"
                              ? `/debate?philosopher=${conversation.philosopherIds[0]}`
                              : `/dialogue?philosopher=${conversation.philosopherIds[0]}`
                          }
                          className="px-4 py-2 bg-primary text-surface-container-lowest rounded-sm font-label text-[10px] uppercase tracking-widest hover:shadow-[0_0_15px_rgba(0,255,163,0.4)] transition-all"
                        >
                          Continue {conversation.type === "debate" ? "Debate" : "Dialogue"}
                        </Link>
                        <button className="px-4 py-2 bg-surface-container border border-outline-variant/30 text-zinc-400 rounded-sm font-label text-[10px] uppercase tracking-widest hover:text-primary hover:border-primary/30 transition-all">
                          Export
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Navigation />
    </>
  );
}
