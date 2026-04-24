"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

interface ConversationSummary {
  id: string;
  title: string;
  philosopherIds: string[];
  philosopherNames: string[];
  lastMessage: string;
  updatedAt: string;
  type: "debate" | "dialogue";
}

interface SidePanelProps {
  philosophers: Array<{
    id: string;
    name: string;
    era: string;
    tradition: string;
    bio: string;
    works: string[];
    ideas: string[];
    imageUrl?: string | null;
  }>;
}

export function SidePanel({ philosophers }: SidePanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [recentConversations, setRecentConversations] = useState<ConversationSummary[]>([]);
  const [pinnedConversations, setPinnedConversations] = useState<ConversationSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"recent" | "pinned">("recent");
  const [activeFilter, setActiveFilter] = useState<"all" | "debate" | "dialogue">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Refresh conversations when panel opens or when pathname changes
  useEffect(() => {
    if (isOpen) {
      loadConversations();
    }
  }, [isOpen, pathname]);

  // Initial load
  useEffect(() => {
    loadConversations();
  }, []);

  // Refresh when page becomes visible (user switches back from another tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isOpen) {
        loadConversations();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isOpen]);

  const loadConversations = async () => {
    setIsLoading(true);
    // Fetch from API like archive page
    try {
      const res = await fetch("/api/conversations?userId=null");
      if (res.ok) {
        const data = await res.json();
        // Deduplicate by conversation ID
        const uniqueMap = new Map<string, ConversationSummary>();
        data.forEach((conv: ConversationSummary) => {
          if (!uniqueMap.has(conv.id)) {
            uniqueMap.set(conv.id, conv);
          }
        });
        const convArray = Array.from(uniqueMap.values())
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        setRecentConversations(convArray);
      }
    } catch (e) {
      console.error("Failed to fetch conversations:", e);
    } finally {
      setIsLoading(false);
    }

    // Load pinned conversations
    const pinnedStored = localStorage.getItem("ai-phi-pinned-conversations");
    if (pinnedStored) {
      try {
        const pinned = JSON.parse(pinnedStored);
        setPinnedConversations(pinned);
      } catch (e) {
        console.error("Failed to parse pinned conversations:", e);
      }
    }
  };

  const togglePin = (conv: ConversationSummary) => {
    const isPinned = pinnedConversations.some(p => p.id === conv.id);
    let newPinned: ConversationSummary[];
    
    if (isPinned) {
      newPinned = pinnedConversations.filter(p => p.id !== conv.id);
    } else {
      newPinned = [conv, ...pinnedConversations];
    }
    
    setPinnedConversations(newPinned);
    localStorage.setItem("ai-phi-pinned-conversations", JSON.stringify(newPinned));
  };

  const startRename = (conv: ConversationSummary) => {
    setEditingId(conv.id);
    setEditingTitle(conv.title);
  };

  const saveRename = async () => {
    if (!editingId) return;

    try {
      await fetch("/api/conversations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, title: editingTitle.trim() }),
      });
      
      // Update local state
      setRecentConversations(prev => prev.map(c => c.id === editingId ? { ...c, title: editingTitle.trim() } : c));
      setPinnedConversations(prev => prev.map(c => c.id === editingId ? { ...c, title: editingTitle.trim() } : c));
    } catch (e) {
      console.error("Failed to rename conversation:", e);
    }

    setEditingId(null);
    setEditingTitle("");
  };

  const cancelRename = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleNewDiscussion = () => {
    setIsOpen(false);
    router.push("/");
  };

  // Filter conversations based on search and type
  const filteredConversations = (activeTab === "recent" ? recentConversations : pinnedConversations).filter(conv => {
    // Type filter
    if (activeFilter !== "all" && conv.type !== activeFilter) return false;
    
    // Search filter
    if (!searchQuery) return true;
    const names = conv.philosopherNames?.join(" ").toLowerCase() || "";
    const title = conv.title.toLowerCase();
    const query = searchQuery.toLowerCase();
    return names.includes(query) || title.includes(query);
  });

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-50 bg-surface border border-r-0 border-outline-variant/50 rounded-r-lg px-2 py-3 hover:bg-surface-container transition-colors shadow-lg"
        aria-label={isOpen ? "Close history" : "Open history"}
      >
        <span className="material-symbols-outlined text-xl text-zinc-400">
          {isOpen ? "chevron_left" : "history"}
        </span>
      </button>

      {/* Side Panel */}
      <div
        className={`fixed left-0 top-0 h-full w-80 bg-surface border-r border-outline-variant/30 z-40 transform transition-transform duration-300 ease-in-out overflow-hidden flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-outline-variant/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-headline text-sm uppercase tracking-widest">History</h2>
            {isLoading && <span className="material-symbols-outlined text-xs animate-spin text-primary">progress_activity</span>}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => loadConversations()}
              className="p-1.5 hover:bg-surface-container rounded-sm transition-colors"
              aria-label="Refresh"
            >
              <span className="material-symbols-outlined text-base text-zinc-500">refresh</span>
            </button>
            <button
              onClick={handleNewDiscussion}
              className="flex items-center gap-1 px-2 py-1 bg-primary text-surface-container-lowest rounded-sm font-label text-[10px] uppercase tracking-widest hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              New
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-outline-variant/10">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container border border-outline-variant/30 rounded-sm pl-9 pr-3 py-2 text-xs placeholder:text-zinc-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-outline-variant/10">
          <button
            onClick={() => setActiveTab("recent")}
            className={`flex-1 py-2 font-label text-[10px] uppercase tracking-widest transition-colors ${
              activeTab === "recent" 
                ? "text-primary border-b-2 border-primary" 
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Recent
          </button>
          <button
            onClick={() => setActiveTab("pinned")}
            className={`flex-1 py-2 font-label text-[10px] uppercase tracking-widest transition-colors ${
              activeTab === "pinned" 
                ? "text-primary border-b-2 border-primary" 
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Pinned ({pinnedConversations.length})
          </button>
        </div>

        {/* Type Filter */}
        <div className="flex gap-1 p-2 border-b border-outline-variant/10 bg-surface-container/30">
          <button
            onClick={() => setActiveFilter("all")}
            className={`flex-1 py-1 px-2 rounded-sm font-label text-[9px] uppercase tracking-wider transition-colors ${
              activeFilter === "all"
                ? "bg-primary text-surface-container-lowest"
                : "bg-surface-container text-zinc-500 hover:text-zinc-300"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter("dialogue")}
            className={`flex-1 py-1 px-2 rounded-sm font-label text-[9px] uppercase tracking-wider transition-colors ${
              activeFilter === "dialogue"
                ? "bg-primary text-surface-container-lowest"
                : "bg-surface-container text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Dialogue
          </button>
          <button
            onClick={() => setActiveFilter("debate")}
            className={`flex-1 py-1 px-2 rounded-sm font-label text-[9px] uppercase tracking-wider transition-colors ${
              activeFilter === "debate"
                ? "bg-primary text-surface-container-lowest"
                : "bg-surface-container text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Debate
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-4 text-center">
              <span className="material-symbols-outlined text-4xl text-zinc-600 mb-2 block">
                {activeTab === "pinned" ? "push_pin" : "chat_bubble_outline"}
              </span>
              <p className="font-label text-xs text-zinc-500 uppercase tracking-widest">
                {activeTab === "pinned" 
                  ? pinnedConversations.length === 0 
                    ? "No pinned conversations" 
                    : "No search results"
                  : "No conversations yet"
                }
              </p>
              <p className="font-body text-xs text-zinc-600 mt-1">
                {activeTab === "pinned" 
                  ? "Pin a conversation to find it here" 
                  : "Start a discussion with a thinker"
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-outline-variant/10">
              {filteredConversations.map((conv) => {
                const names = conv.philosopherNames?.join(" & ") || conv.philosopherIds.join(" & ");
                const pinned = pinnedConversations.some(p => p.id === conv.id);
                const isEditing = editingId === conv.id;
                const linkUrl = conv.philosopherIds.length > 1
                  ? `/arena?${conv.philosopherIds.map((id) => `philosopher=${id}`).join("&")}`
                  : `/arena?philosopher=${conv.philosopherIds[0]}`;

                return (
                  <div
                    key={conv.id}
                    className="relative group"
                  >
                    <Link
                      href={linkUrl}
                      onClick={() => { if (!isEditing) setIsOpen(false); }}
                      className="block p-3 hover:bg-surface-container transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        {/* Conversation Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-label text-[10px] text-primary uppercase tracking-widest truncate">
                              {names}
                            </p>
                            {/* Type Label */}
                            <span className={`flex-shrink-0 px-1.5 py-0.5 rounded-sm font-label text-[8px] uppercase tracking-wider border ${
                              conv.type === "debate" 
                                ? "bg-secondary/20 text-secondary border-secondary/30" 
                                : "bg-primary/20 text-primary border-primary/30"
                            }`}>
                              {conv.type === "debate" ? "Debate" : "Dialogue"}
                            </span>
                          </div>
                          {isEditing ? (
                            <div className="mt-1" onClick={(e) => e.preventDefault()}>
                              <input
                                type="text"
                                value={editingTitle}
                                onChange={(e) => setEditingTitle(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") saveRename();
                                  if (e.key === "Escape") cancelRename();
                                }}
                                onClick={(e) => e.stopPropagation()}
                                autoFocus
                                className="w-full bg-surface border border-primary rounded-sm px-2 py-1 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-primary/20"
                              />
                              <div className="flex gap-1 mt-1">
                                <button
                                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); saveRename(); }}
                                  className="px-2 py-0.5 bg-primary text-surface-container-lowest rounded-sm text-[9px] font-label uppercase"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); cancelRename(); }}
                                  className="px-2 py-0.5 bg-surface-container text-zinc-400 rounded-sm text-[9px] font-label uppercase"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="font-body text-xs text-zinc-300 truncate mt-0.5">
                                {conv.title}
                              </p>
                              <p className="font-label text-[9px] text-zinc-600 uppercase tracking-widest mt-1">
                                {formatDate(conv.updatedAt)}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </Link>

                    {/* Action Buttons */}
                    {!isEditing && (
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Rename Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            startRename(conv);
                          }}
                          className="p-1.5 bg-surface-container text-zinc-500 hover:text-primary rounded-sm transition-colors"
                          aria-label="Rename conversation"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>

                        {/* Pin Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            togglePin(conv);
                          }}
                          className={`p-1.5 rounded-sm transition-colors ${
                            pinned 
                              ? "bg-primary/20 text-primary" 
                              : "bg-surface-container text-zinc-500 hover:text-primary"
                          }`}
                          aria-label={pinned ? "Unpin conversation" : "Pin conversation"}
                        >
                          <span className="material-symbols-outlined text-sm">push_pin</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-outline-variant/20">
          <Link
            href="/archive"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-2 text-zinc-500 hover:text-primary transition-colors font-label text-[10px] uppercase tracking-widest"
          >
            <span className="material-symbols-outlined text-sm">inventory_2</span>
            View Full Archive
          </Link>
        </div>
      </div>

      {/* Overlay when panel is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
