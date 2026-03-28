import Link from "next/link";

const features = [
  {
    href: "/debate",
    title: "Debate Chamber",
    description: "Place philosophers side by side and watch them debate",
    icon: "forum",
    color: "primary",
  },
  {
    href: "/dialogue",
    title: "Dialogue Interface",
    description: "Engage in deep one-on-one conversations",
    icon: "chat",
    color: "secondary",
  },
  {
    href: "/dossier",
    title: "Philosopher Dossiers",
    description: "Explore biographies, works, and ideas",
    icon: "library_books",
    color: "tertiary",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <header className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-display text-primary mb-4">
          AI-Phi
        </h1>
        <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto">
          A digital agora where you can engage with historical and contemporary
          thinkers from diverse philosophical traditions.
        </p>
      </header>

      <nav className="max-w-4xl mx-auto">
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature) => (
            <li key={feature.href}>
              <Link
                href={feature.href}
                className="block p-6 rounded-2xl bg-surface-variant hover:bg-surface-container-highest transition-colors border border-outline-variant group"
              >
                <span
                  className={`material-symbols-outlined text-4xl text-${feature.color} mb-4 block`}
                >
                  {feature.icon}
                </span>
                <h2 className="text-xl font-display text-on-surface mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h2>
                <p className="text-on-surface-variant text-sm">
                  {feature.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <section className="max-w-4xl mx-auto mt-16">
        <h2 className="text-2xl font-display text-on-surface mb-6 text-center">
          Featured Philosophers
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            "Socrates",
            "Confucius",
            "Aristotle",
            "Lao Tzu",
            "Nietzsche",
            "Simone de Beauvoir",
            "Frantz Fanon",
            "Wang Yangming",
          ].map((name) => (
            <button
              key={name}
              className="px-4 py-2 rounded-full bg-surface-variant text-on-surface-variant hover:bg-primary hover:text-on-primary transition-colors text-sm"
            >
              {name}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
