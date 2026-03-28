import Link from "next/link";

export default function SettingsPage() {
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
          <span className="material-symbols-outlined text-zinc-400 hover:text-primary transition-colors duration-200 cursor-pointer">
            notifications
          </span>
        </div>
      </header>
      <main className="pt-20 pb-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-zinc-600 mb-4 block">
            settings
          </span>
          <h2 className="font-headline text-2xl text-on-surface mb-2">Settings</h2>
          <p className="text-on-surface-variant">Application settings will appear here.</p>
          <Link href="/" className="inline-block mt-6 text-primary hover:underline">
            ← Back to Hub
          </Link>
        </div>
      </main>
    </>
  );
}
