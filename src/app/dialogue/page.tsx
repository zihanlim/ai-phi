"use client";

import { useState } from "react";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

const mockMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "You ask of the void. I tell you: God is dead. God remains dead. And we have killed him. How shall we comfort ourselves, the murderers of all murderers? What was holiest and mightiest of all that the world has yet owned has bled to death under our knives: who will wipe this blood off us?",
    timestamp: "Analytical Output_01",
  },
  {
    id: "2",
    role: "user",
    content:
      "If the old foundations are gone, what replaces the structure of morality? Are we not destined for a descent into nihilism?",
    timestamp: "User Inquiry",
  },
  {
    id: "3",
    role: "assistant",
    content:
      "Nihilism is but a transitional stage. The &quot;Higher Man&quot; does not mourn the loss of the old sun; he becomes his own light. We must create our own values. He who has a why to live can bear almost any how.",
    timestamp: "Analytical Output_02",
  },
];

const quickLogicTags = [
  "Historical Context",
  "Logical Fallacy Check",
  "Socratic Counter",
  "Paradox Identification",
];

export default function DialoguePage() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [contextAnalyzerOn, setContextAnalyzerOn] = useState(true);

  const philosopherName = "Friedrich Nietzsche";
  const conversationTopic = "THE DEATH OF GOD.";
  const sessionInfo = "Existential Synthesis";
  const sourceText = "Thus Spoke Zarathustra (1883)";

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue,
      timestamp: "User Inquiry",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content:
          "The will to power creates its own values. What appears as chaos is merely the overflow of life seeking new forms of expression. Embrace the abyss of meaninglessness and forge your own meaning.",
        timestamp: "Analytical Output",
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <>
      <header className="fixed top-0 w-full z-50 border-b border-[#27272a] bg-[#09090b]">
        <div className="flex justify-between items-center px-6 h-16 w-full">
          <div className="flex items-center gap-4">
            <button className="text-primary active:scale-95 transition-transform">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h1 className="font-headline font-bold tracking-tighter uppercase text-2xl text-primary">
              DIGITAL AGORA
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="font-label text-[10px] text-zinc-500 uppercase tracking-widest">
                Active Logic Node
              </span>
              <span className="font-headline text-sm text-primary uppercase">
                {philosopherName}
              </span>
            </div>
            <button className="text-zinc-400 hover:text-primary transition-colors duration-200 active:scale-95 transition-transform">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
        </div>
      </header>

      <main className="pt-16 pb-40 min-h-screen max-w-4xl mx-auto px-6">
        <div className="py-12 flex flex-col items-start gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high border border-outline-variant/20 rounded-sm">
            <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,255,163,0.5)]" />
            <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-[0.2em]">
              Session: {sessionInfo}
            </span>
          </div>
          <h2 className="font-headline text-5xl md:text-7xl leading-none text-on-surface tracking-tighter">
            {conversationTopic}
          </h2>
          <p className="font-label text-sm text-primary mt-2 opacity-80 uppercase tracking-widest">
            Synthesizing: {sourceText}
          </p>
        </div>

        <div className="space-y-12">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col gap-3 ${
                message.role === "user" ? "items-end max-w-[80%] ml-auto" : "items-start max-w-[85%]"
              }`}
            >
              <div className="font-label text-[10px] text-zinc-500 uppercase tracking-widest px-1">
                {message.timestamp}
              </div>
              {message.role === "assistant" ? (
                <div className="bg-[#18181b] p-6 border-l-2 border-primary rounded-sm">
                  <p
                    className="text-lg leading-relaxed text-on-surface font-body"
                    dangerouslySetInnerHTML={{ __html: message.content }}
                  />
                </div>
              ) : (
                <div className="border border-[#27272a] p-6 bg-transparent rounded-sm backdrop-blur-sm">
                  <p className="text-lg leading-relaxed text-zinc-300">{message.content}</p>
                </div>
              )}
              {message.role === "assistant" && (
                <div className="flex gap-4 px-1">
                  <button className="font-label text-[10px] text-zinc-600 hover:text-primary transition-colors uppercase">
                    Cite Logic
                  </button>
                  <button className="font-label text-[10px] text-zinc-600 hover:text-primary transition-colors uppercase">
                    Branch Thought
                  </button>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex flex-col items-start gap-3">
              <div className="font-label text-[10px] text-zinc-500 uppercase tracking-widest px-1">
                Synthesizing...
              </div>
              <div className="flex gap-1 items-center px-1">
                <span className="font-label text-primary text-xl blinking-cursor">_</span>
                <span className="font-label text-primary text-xl opacity-40">_</span>
                <span className="font-label text-primary text-xl opacity-20">_</span>
              </div>
            </div>
          )}
        </div>
      </main>

      <section className="fixed bottom-0 left-0 w-full z-50 bg-[#0e0e10]/95 backdrop-blur-2xl border-t border-[#27272a]">
        <div className="max-w-4xl mx-auto px-6 pt-4 pb-8">
          <div
            className="flex items-center gap-2 mb-4 group cursor-pointer"
            onClick={() => setContextAnalyzerOn(!contextAnalyzerOn)}
          >
            <div
              className={`w-8 h-4 rounded-full relative flex items-center px-1 border transition-all ${
                contextAnalyzerOn
                  ? "bg-primary/20 border-primary/30"
                  : "bg-surface-container border-outline-variant"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full transition-all ${
                  contextAnalyzerOn
                    ? "bg-primary shadow-[0_0_8px_#00ffa3] translate-x-4"
                    : "bg-zinc-500"
                }`}
              />
            </div>
            <span
              className={`font-label text-[10px] uppercase tracking-[0.2em] group-hover:drop-shadow-[0_0_4px_rgba(0,255,163,0.5)] transition-all ${
                contextAnalyzerOn ? "text-primary" : "text-zinc-500"
              }`}
            >
              CONTEXT ANALYZER: {contextAnalyzerOn ? "ON" : "OFF"}
            </span>
          </div>

          <div className="relative bg-surface-container-lowest border-b border-primary flex items-end p-2 transition-all focus-within:bg-surface-container">
            <button className="p-3 text-zinc-500 hover:text-on-surface transition-colors active:scale-90">
              <span className="material-symbols-outlined">mic</span>
            </button>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="CHALLENGE THE SUPPOSED TRUTH..."
              rows={1}
              className="w-full bg-transparent border-none focus:ring-0 text-on-surface font-body resize-none py-3 px-2 placeholder:text-zinc-600 placeholder:font-label placeholder:text-xs placeholder:tracking-widest"
            />
            <div className="flex items-center gap-2 p-1">
              <button className="p-3 text-zinc-500 hover:text-on-surface transition-colors active:scale-90">
                <span className="material-symbols-outlined">attach_file</span>
              </button>
              <button
                onClick={handleSend}
                className="bg-primary text-black h-10 w-10 flex items-center justify-center rounded-sm hover:shadow-[0_0_15px_rgba(0,255,163,0.4)] transition-all active:scale-90"
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  send
                </span>
              </button>
            </div>
          </div>

          <div className="flex gap-3 mt-4 overflow-x-auto pb-2 hide-scrollbar">
            {quickLogicTags.map((tag) => (
              <button
                key={tag}
                className="whitespace-nowrap font-label text-[9px] text-zinc-500 border border-outline-variant/30 px-3 py-1 rounded-sm hover:border-primary hover:text-on-surface transition-all uppercase tracking-widest"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      <nav className="fixed bottom-0 left-0 w-full h-20 bg-surface/80 backdrop-blur-xl border-t border-outline-variant flex justify-around items-center px-4 pb-4 z-40 md:hidden">
        <Link
          href="/"
          className="flex flex-col items-center justify-center text-zinc-500 hover:text-zinc-200 active:scale-90 transition-all"
        >
          <span className="material-symbols-outlined">grid_view</span>
          <span className="font-mono text-[10px] uppercase tracking-widest mt-1">Hub</span>
        </Link>
        <Link
          href="/archive"
          className="flex flex-col items-center justify-center text-zinc-500 hover:text-zinc-200 active:scale-90 transition-all"
        >
          <span className="material-symbols-outlined">history_edu</span>
          <span className="font-mono text-[10px] uppercase tracking-widest mt-1">Archive</span>
        </Link>
        <Link
          href="/settings"
          className="flex flex-col items-center justify-center text-zinc-500 hover:text-zinc-200 active:scale-90 transition-all"
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="font-mono text-[10px] uppercase tracking-widest mt-1">Settings</span>
        </Link>
      </nav>
    </>
  );
}
