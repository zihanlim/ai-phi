"use client";

import { useState, useEffect } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState("Anonymous");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load saved settings from localStorage
    const savedName = localStorage.getItem("ai-phi-display-name");

    if (savedName) {
      setDisplayName(savedName);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("ai-phi-display-name", displayName);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <main className="pt-16 pb-32 min-h-screen">
        <section className="p-6 max-w-2xl mx-auto">
          <Breadcrumbs items={[{ label: "Settings" }]} />
          <div className="flex items-center gap-3 mt-4 mb-8">
            <span className="material-symbols-outlined text-primary text-2xl">settings</span>
            <h2 className="font-headline text-3xl uppercase tracking-widest">
              Settings
            </h2>
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

    </>
  );
}
