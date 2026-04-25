import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-surface-container border-t border-outline-variant/20 px-6 py-12 pb-[120px]">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Logo & Social */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-3xl">
                psychology
              </span>
              <span className="font-headline text-xl uppercase tracking-tight">
                AI-Phi
              </span>
            </div>
            <p className="text-sm text-on-surface-variant">
              Engage in intellectual dialogue with historical and contemporary
              thinkers.
            </p>
            <div className="flex gap-3 mt-2">
              <a
                href="#"
                className="text-zinc-500 hover:text-primary transition-colors"
                aria-label="Discord"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-zinc-500 hover:text-primary transition-colors"
                aria-label="Reddit"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1-.042.52c0 2.694 3.13 4.87 6.986 4.87 3.855 0 6.992-2.176 6.992-4.87 0-2.694-3.137-4.87-6.992-4.87-.983 0-1.914.518-2.462 1.24l-.058.03c-1.874 1.756-3.735 1.757-5.712 0l-.058-.03c-.548-.722-1.479-1.24-2.462-1.24-.829 0-1.58.342-2.203.882-.428.386-.688.822-.688 1.349 0 .968.786 1.754 1.754 1.754.48 0 .899-.182 1.207-.491 1.194-.856 2.85-1.42 4.674-1.488l-.8-3.747-2.597.547c-.088.016-.191.024-.299.024-.214 0-.391-.074-.497-.207-.106-.133-.158-.313-.158-.497 0-.214.074-.391.207-.497.133-.106.313-.158.497-.158.108 0 .211.008.299.024l2.597-.547.8 3.747c-1.824-.07-3.48-.632-4.674-1.488C8.936 9.818 8.664 10 8.303 10c-.968 0-1.754-.786-1.754-1.754 0-.527.26-.963.688-1.349C7.72 8.59 8.47 8.248 9.3 8.248c.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1-.042.52c0 2.694 3.13 4.87 6.986 4.87 3.855 0 6.992-2.176 6.992-4.87 0-2.694-3.137-4.87-6.992-4.87z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-zinc-500 hover:text-primary transition-colors"
                aria-label="TikTok"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-zinc-500 hover:text-primary transition-colors"
                aria-label="Twitter/X"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-zinc-500 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Features */}
          <div>
            <h3 className="font-label text-[10px] uppercase tracking-widest text-outline mb-4">
              Features
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  Get App
                </a>
              </li>
              <li>
                <Link
                  href="/arena"
                  className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  Create Session
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  Privacy Choices
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  Delete Account
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  Export Data
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Explore */}
          <div>
            <h3 className="font-label text-[10px] uppercase tracking-widest text-outline mb-4">
              Explore
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dossier"
                  className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  All Thinkers
                </Link>
              </li>
              <li>
                <Link
                  href="/dossier?category=philosophers"
                  className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  Philosophers
                </Link>
              </li>
              <li>
                <Link
                  href="/dossier?category=macro"
                  className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  Macro Investors
                </Link>
              </li>
              <li>
                <Link
                  href="/dossier?category=risk"
                  className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  Risk Thinkers
                </Link>
              </li>
              <li>
                <Link
                  href="/dossier?category=value"
                  className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  Value Investors
                </Link>
              </li>
              <li>
                <Link
                  href="/dossier?category=quant"
                  className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  Quant Strategies
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Overview */}
          <div>
            <h3 className="font-label text-[10px] uppercase tracking-widest text-outline mb-4">
              Overview
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  Contact & Support
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  Community Guidelines
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-outline-variant/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm font-headline uppercase tracking-tight">
              AI-Phi | Digital Agora
            </p>
            <p className="text-xs text-on-surface-variant mt-1">
              Version 1.0.0
            </p>
            <p className="text-xs text-on-surface-variant">
              Designed and Engineered by Lim Zi Han
            </p>
          </div>
          <p className="text-sm text-on-surface-variant">
            ©2026 AI-Phi. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
