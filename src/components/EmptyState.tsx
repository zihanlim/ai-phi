import Link from "next/link";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  cta?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

export function EmptyState({ icon, title, description, cta, className = "" }: EmptyStateProps) {
  return (
    <div className={`text-center py-12 ${className}`}>
      <span className="material-symbols-outlined text-5xl text-zinc-600 mb-3 block">
        {icon}
      </span>
      <h3 className="font-headline text-xl text-zinc-400 mb-2">{title}</h3>
      <p className="text-on-surface-variant text-sm max-w-md mx-auto mb-4">
        {description}
      </p>
      {cta && (
        cta.href ? (
          <Link
            href={cta.href}
            className="px-6 py-3 rounded-sm font-headline font-bold uppercase tracking-widest bg-primary text-surface-container-lowest hover:shadow-[0_0_20px_rgba(0,255,163,0.4)] transition-all active:scale-95 inline-flex items-center gap-2"
          >
            {cta.label}
          </Link>
        ) : (
          <button
            onClick={cta.onClick}
            className="px-6 py-3 rounded-sm font-headline font-bold uppercase tracking-widest bg-primary text-surface-container-lowest hover:shadow-[0_0_20px_rgba(0,255,163,0.4)] transition-all active:scale-95"
          >
            {cta.label}
          </button>
        )
      )}
    </div>
  );
}
