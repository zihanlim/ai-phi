"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";

type AIProvider = "openai" | "anthropic";

export default function SettingsPage() {
  const [aiProvider, setAiProvider] = useState<AIProvider>("openai");
  const [displayName, setDisplayName] = useState("Anonymous");
  const [isDarkMode] = useState(true); // App is always dark mode
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load saved settings from localStorage
    const savedProvider = localStorage.getItem("ai-phi-ai-provider") as AIProvider | null;
    const savedName = localStorage.getItem("ai-phi-display-name");

    if (savedProvider) {
      setAiProvider(savedProvider);
    }
    if (savedName) {
      setDisplayName(savedName);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("ai-phi-ai-provider", aiProvider);
    localStorage.setItem("ai-phi-display-name", displayName);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
            Settings
          </span>
          <span className="material-symbols-outlined text-zinc-400 hover:text-primary transition-colors duration-200 cursor-pointer">
            notifications
          </span>
        </div>
      </header>

      <main className="pt-16 pb-32 min-h-screen">
        <section className="p-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-primary text-2xl">settings</span>
            <h2 className="font-headline text-3xl uppercase tracking-widest">
              Settings
            </h2>
          </div>

          {/* AI Provider Selection */}
          <div className="mb-8">
            <h3 className="font-label text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">psychology</span>
              AI Provider
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setAiProvider("openai")}
                className={`p-6 rounded-sm border transition-all text-left ${
                  aiProvider === "openai"
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-surface-container border-outline-variant text-zinc-400 hover:border-primary/30"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center">
                    <span className="font-headline text-sm font-bold">O</span>
                  </div>
                  <div>
                    <p className="font-headline uppercase tracking-tight">OpenAI</p>
                    <p className="font-label text-[9px] text-zinc-500">GPT-4 Model</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-500">
                  Advanced reasoning with GPT-4
                </p>
              </button>

              <button
                onClick={() => setAiProvider("anthropic")}
                className={`p-6 rounded-sm border transition-all text-left ${
                  aiProvider === "anthropic"
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-surface-container border-outline-variant text-zinc-400 hover:border-primary/30"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center">
                    <span className="font-headline text-sm font-bold">A</span>
                  </div>
                  <div>
                    <p className="font-headline uppercase tracking-tight">Anthropic</p>
                    <p className="font-label text-[9px] text-zinc-500">Claude Model</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-500">
                  Nuanced analysis with Claude
                </p>
              </button>
            </div>
          </div>

          {/* User Display Name */}
          <div className="mb-8">
            <h3 className="font-label text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">person</span>
              Display Name
            </h3>
            <div className="relative">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
                className="w-full bg-surface-container border border-outline-variant/30 rounded-sm px-4 py-3 text-on-surface placeholder:text-zinc-600 focus:outline-none focus:border-primary transition-colors font-body"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-label text-[10px] text-zinc-500">
                {displayName.length}/32
              </span>
            </div>
          </div>

          {/* Theme Toggle (Note: App is always dark) */}
          <div className="mb-8">
            <h3 className="font-label text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">dark_mode</span>
              Theme
            </h3>
            <div className="bg-surface-container border border-outline-variant/20 rounded-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-headline text-sm uppercase tracking-tight">
                    Dark Mode
                  </p>
                  <p className="font-label text-[10px] text-zinc-500 mt-1">
                    This application is optimized for dark theme only
                  </p>
                </div>
                <div className="w-12 h-6 rounded-full bg-primary/30 flex items-center px-1 cursor-not-allowed relative">
                  <div className="w-4 h-4 rounded-full bg-primary translate-x-6 transition-all shadow-[0_0_8px_rgba(0,255,163,0.5)]" />
                </div>
              </div>
            </div>
          </div>

          {/* App Info */}
          <div className="mb-8">
            <h3 className="font-label text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">info</span>
              Application Info
            </h3>
            <div className="bg-surface-container border border-outline-variant/20 rounded-sm p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-label text-[10px] text-zinc-500 uppercase">Version</span>
                <span className="font-label text-[10px] text-on-surface">1.0.0</span>
              </div>
              <div className="h-px bg-outline-variant/20" />
              <div className="flex justify-between items-center">
                <span className="font-label text-[10px] text-zinc-500 uppercase">Repository</span>
                <a
                  href="https://github.com/zihanlim/ai-phi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-label text-[10px] text-primary hover:underline flex items-center gap-1"
                >
                  GitHub
                  <span className="material-symbols-outlined text-xs">open_in_new</span>
                </a>
              </div>
              <div className="h-px bg-outline-variant/20" />
              <div className="flex justify-between items-center">
                <span className="font-label text-[10px] text-zinc-500 uppercase">Framework</span>
                <span className="font-label text-[10px] text-on-surface">Next.js</span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full bg-primary text-surface-container-lowest py-4 rounded-sm font-headline font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:shadow-[0_0_25px_rgba(0,255,163,0.4)] transition-all active:scale-95"
          >
            {saved ? (
              <>
                <span className="material-symbols-outlined">check</span>
                Settings Saved
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">save</span>
                Save Settings
              </>
            )}
          </button>
        </section>
      </main>

      <Navigation />
    </>
  );
}
