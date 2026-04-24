"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { LoadingDots } from "@/components/LoadingDots";
import { EmptyState } from "@/components/EmptyState";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ConfirmDialog } from "@/components/ConfirmDialog";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "dialogue" | "debate">("all");
  const [deleteTarget, setDeleteTarget] = useState<Conversation | null>(null);
  const [renameTarget, setRenameTarget] = useState<Conversation | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [exportTarget, setExportTarget] = useState<Conversation | null>(null);

  useEffect(() => {
    async function fetchConversations() {
      try {
        // Fetch all conversations (userId is null for anonymous users)
        const res = await fetch("/api/conversations?userId=null");
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

  const filteredConversations = useMemo(() => {
    // Deduplicate by conversation ID first
    const uniqueMap = new Map<string, Conversation>();
    conversations.forEach((conv) => {
      if (!uniqueMap.has(conv.id)) {
        uniqueMap.set(conv.id, conv);
      }
    });
    const uniqueConversations = Array.from(uniqueMap.values());
    
    return uniqueConversations.filter((conv) => {
      const matchesSearch =
        searchQuery === "" ||
        conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.philosopherNames.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase())) ||
        conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === "all" || conv.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [conversations, searchQuery, filterType]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await fetch(`/api/conversations?id=${deleteTarget.id}`, { method: "DELETE" });
      setConversations((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    } catch {
      console.error("Failed to delete conversation");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleRename = async () => {
    if (!renameTarget || !renameValue.trim()) return;
    try {
      await fetch("/api/conversations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: renameTarget.id, title: renameValue.trim() }),
      });
      setConversations((prev) =>
        prev.map((c) =>
          c.id === renameTarget.id ? { ...c, title: renameValue.trim() } : c
        )
      );
    } catch {
      console.error("Failed to rename conversation");
    } finally {
      setRenameTarget(null);
      setRenameValue("");
    }
  };

  const exportConversation = (conv: Conversation, format: "json" | "text") => {
    if (format === "json") {
      const data = JSON.stringify(conv, null, 2);
      downloadFile(data, `${conv.title.replace(/\s+/g, "_")}.json`, "application/json");
    } else {
      const text = [
        `# ${conv.title}`,
        `Type: ${conv.type === "debate" ? "Debate" : "Dialogue"}`,
        `Participants: ${conv.philosopherNames.join(", ")}`,
        `Last updated: ${formatDate(conv.updatedAt)}`,
        "",
        "---",
        "",
        conv.lastMessage,
      ].join("\n");
      downloadFile(text, `${conv.title.replace(/\s+/g, "_")}.txt`, "text/plain");
    }
    setExportTarget(null);
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
      <main className="pt-16 pb-32 min-h-screen">
        <section className="p-6">
          <Breadcrumbs items={[{ label: "Archive" }]} />
          <div className="flex items-center gap-3 mt-4 mb-8">
            <span className="material-symbols-outlined text-primary text-2xl">history_edu</span>
            <h2 className="font-headline text-3xl uppercase tracking-widest">
              Conversation Archive
            </h2>
          </div>

          {/* Search and Filter */}
          {!loading && conversations.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xl">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full bg-surface-container border border-outline-variant/30 rounded-sm pl-10 pr-4 py-2 text-on-surface placeholder:text-zinc-600 focus:outline-none focus:border-primary transition-colors font-body text-sm"
                />
              </div>
              <div className="flex gap-2">
                {(["all", "dialogue", "debate"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-2 rounded-sm font-label text-[10px] uppercase tracking-widest transition-all ${
                      filterType === type
                        ? "bg-primary/20 border border-primary/30 text-primary"
                        : "bg-surface-container border border-outline-variant/30 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <LoadingDots />
            </div>
          ) : filteredConversations.length === 0 ? (
            conversations.length === 0 ? (
              <EmptyState
                icon="folder_open"
                title="No Saved Conversations"
                description="Your dialogues and debates will be saved here for future reference. Start a conversation with a philosopher to build your archive."
                cta={{ label: "Return to Hub", href: "/" }}
              />
            ) : (
              <EmptyState
                icon="search_off"
                title="No Results Found"
                description="No conversations match your search or filter criteria."
                cta={{ label: "Clear Filters", onClick: () => { setSearchQuery(""); setFilterType("all"); } }}
              />
            )
          ) : (
            <div className="space-y-4">
              {filteredConversations.map((conversation) => (
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
                      <div className="flex flex-wrap gap-3">
                        <Link
                          href={
                            `/arena?philosopher=${conversation.philosopherIds.join("&philosopher=")}`
                          }
                          className="px-4 py-2 bg-primary text-surface-container-lowest rounded-sm font-label text-[10px] uppercase tracking-widest hover:shadow-[0_0_15px_rgba(0,255,163,0.4)] transition-all"
                        >
                          Continue {conversation.type === "debate" ? "Debate" : "Dialogue"}
                        </Link>
                        <button
                          onClick={() => { setRenameTarget(conversation); setRenameValue(conversation.title); }}
                          className="px-4 py-2 bg-surface-container border border-outline-variant/30 text-zinc-400 rounded-sm font-label text-[10px] uppercase tracking-widest hover:text-primary hover:border-primary/30 transition-all"
                        >
                          Rename
                        </button>
                        <button
                          onClick={() => setExportTarget(conversation)}
                          className="px-4 py-2 bg-surface-container border border-outline-variant/30 text-zinc-400 rounded-sm font-label text-[10px] uppercase tracking-widest hover:text-primary hover:border-primary/30 transition-all"
                        >
                          Export
                        </button>
                        <button
                          onClick={() => setDeleteTarget(conversation)}
                          className="px-4 py-2 bg-surface-container border border-red-700/30 text-red-500 rounded-sm font-label text-[10px] uppercase tracking-widest hover:bg-red-900/30 hover:border-red-600 transition-all"
                        >
                          Delete
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

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Delete Conversation"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        destructive
      />

      {/* Rename Dialog */}
      {renameTarget !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
          <div className="bg-surface-container border border-outline-variant rounded-sm p-6 w-full max-w-md mx-4">
            <h3 className="font-headline text-xl uppercase tracking-widest mb-4">
              Rename Conversation
            </h3>
            <input
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleRename(); }}
              autoFocus
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-sm px-4 py-3 text-on-surface placeholder:text-zinc-600 focus:outline-none focus:border-primary transition-colors font-body mb-4"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setRenameTarget(null); setRenameValue(""); }}
                className="px-4 py-2 bg-surface-container border border-outline-variant text-zinc-400 rounded-sm font-label text-[10px] uppercase tracking-widest hover:text-white hover:border-zinc-400 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleRename}
                disabled={!renameValue.trim()}
                className="px-4 py-2 bg-primary/20 border border-primary/30 text-primary rounded-sm font-label text-[10px] uppercase tracking-widest hover:bg-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Dialog */}
      {exportTarget !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
          <div className="bg-surface-container border border-outline-variant rounded-sm p-6 w-full max-w-md mx-4">
            <h3 className="font-headline text-xl uppercase tracking-widest mb-4">
              Export Conversation
            </h3>
            <p className="text-on-surface-variant text-sm mb-6">
              Choose a format to export "{exportTarget.title}":
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setExportTarget(null)}
                className="px-4 py-2 bg-surface-container border border-outline-variant text-zinc-400 rounded-sm font-label text-[10px] uppercase tracking-widest hover:text-white hover:border-zinc-400 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => exportConversation(exportTarget, "text")}
                className="px-4 py-2 bg-surface-container border border-outline-variant/30 text-zinc-400 rounded-sm font-label text-[10px] uppercase tracking-widest hover:text-primary hover:border-primary/30 transition-all"
              >
                Export as Text
              </button>
              <button
                onClick={() => exportConversation(exportTarget, "json")}
                className="px-4 py-2 bg-primary/20 border border-primary/30 text-primary rounded-sm font-label text-[10px] uppercase tracking-widest hover:bg-primary/30 transition-all"
              >
                Export as JSON
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
