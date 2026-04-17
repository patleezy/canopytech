import type { Metadata } from "next";
import Link from "next/link";
import { SavedBriefBanner } from "@/components/landing/SavedBriefBanner";

export const metadata: Metadata = {
  title: "Canopy Tech — Build on solid ground",
  description:
    "Structure your project correctly before you write a single line of code. Get an AI-powered architecture review in 5 minutes.",
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-forest-950 flex flex-col">
      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <CanopyLogo className="w-6 h-6 text-amber-canopy" />
          <span className="text-sm font-semibold text-text-primary tracking-tight">
            Canopy Tech
          </span>
        </div>
        <span className="text-xs text-text-muted hidden sm:block">
          canopytech.app
        </span>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-4 pt-12 pb-16 sm:pt-20 sm:pb-20 text-center">
        <div className="flex flex-col items-center gap-8 max-w-2xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-800 border border-forest-600 text-xs text-text-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-canopy animate-pulse" />
            AI-powered architecture review
          </div>

          {/* Headline */}
          <div className="flex flex-col items-center gap-3">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary tracking-tight leading-tight">
              Build on solid ground
            </h1>
            <p className="text-lg sm:text-xl text-text-primary max-w-lg leading-relaxed font-medium">
              Ask the questions your future CTO would ask —<br className="hidden sm:block" /> before you write a line of code.
            </p>
            <p className="text-sm text-text-muted max-w-md leading-relaxed">
              5 layers of questions. Tech stack, cost estimate, compliance flags,
              and a system prompt ready to paste into your AI tool.
            </p>
          </div>

          {/* Saved brief banner — only shown if one exists in localStorage */}
          <div className="w-full">
            <SavedBriefBanner />
          </div>

          {/* CTA Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-2">
            {/* Start New Project */}
            <Link
              href="/interview"
              className="group relative flex flex-col gap-4 p-6 rounded-2xl bg-forest-800 border border-forest-600 text-left transition-all duration-200 hover:bg-forest-750 hover:border-amber-canopy/50 hover:shadow-[0_0_28px_rgba(217,119,6,0.1)]"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-canopy/10 border border-amber-canopy/20 flex items-center justify-center">
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    className="w-5 h-5 text-amber-canopy"
                    aria-hidden="true"
                  >
                    <path
                      d="M10 3v14M3 10h14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  className="w-4 h-4 text-text-muted group-hover:text-amber-canopy transition-colors"
                  aria-hidden="true"
                >
                  <path
                    d="M4 8h8M8 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-base font-semibold text-text-primary">
                  Start New Project
                </span>
                <span className="text-sm text-text-secondary">
                  5-layer interview → full architecture brief
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <ClockIcon className="w-3.5 h-3.5" />
                About 5 minutes
              </div>
            </Link>

            {/* Audit Existing — disabled */}
            <div
              className="relative flex flex-col gap-4 p-6 rounded-2xl bg-forest-900 border border-forest-700 text-left opacity-50 cursor-not-allowed select-none"
              aria-disabled="true"
              role="button"
              aria-label="Audit Existing Project — coming in Sprint 2"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-forest-700 border border-forest-600 flex items-center justify-center">
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    className="w-5 h-5 text-text-muted"
                    aria-hidden="true"
                  >
                    <path
                      d="M9 3H4a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1v-5M13 3l4 4m0 0L9 15l-4 1 1-4 7-7z"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-forest-700 border border-forest-600 text-xs text-text-muted">
                  Sprint 2
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-base font-semibold text-text-secondary">
                  Audit Existing Project
                </span>
                <span className="text-sm text-text-muted">
                  Submit a repo URL → get a readiness report
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <ClockIcon className="w-3.5 h-3.5" />
                Coming soon
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Use Canopy? */}
      <section className="border-t border-forest-800 px-4 py-14 sm:py-20">
        <div className="max-w-2xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary text-center">
              Why use Canopy Tech?
            </h2>
            <p className="text-text-secondary text-center leading-relaxed max-w-lg mx-auto">
              Most builders skip the planning stage and go straight to code.
              Here&apos;s what usually goes wrong:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PAIN_POINTS.map((point) => (
              <div
                key={point.title}
                className="flex gap-4 p-5 rounded-xl bg-forest-900 border border-forest-700"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-forest-800 border border-forest-600 flex items-center justify-center text-base">
                  {point.emoji}
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-text-primary">
                    {point.title}
                  </p>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {point.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center flex flex-col gap-4">
            <p className="text-text-secondary text-sm leading-relaxed max-w-md mx-auto">
              Canopy asks the right questions{" "}
              <span className="text-text-primary font-medium">
                before any of that happens.
              </span>{" "}
              Five minutes of planning now saves days — sometimes months — of
              rework later.
            </p>
            <Link
              href="/interview"
              className="inline-flex items-center gap-2 mx-auto px-6 py-2.5 rounded-xl bg-amber-canopy text-forest-950 text-sm font-semibold hover:bg-amber-canopy-light transition-all shadow-[0_2px_16px_rgba(217,119,6,0.3)]"
            >
              Start for free
              <svg
                viewBox="0 0 16 16"
                fill="none"
                className="w-3.5 h-3.5"
                aria-hidden="true"
              >
                <path
                  d="M4 8h8M8 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-4 flex items-center justify-center border-t border-forest-800 mt-auto">
        <p className="text-xs text-text-muted">
          Canopy Tech &mdash; Build on solid ground
        </p>
      </footer>
    </main>
  );
}

const PAIN_POINTS = [
  {
    emoji: "🗄️",
    title: "Wrong database for the job",
    body: "You pick one that feels familiar, not one that fits the data model. Migrating later costs weeks.",
  },
  {
    emoji: "🔐",
    title: "Auth bolted on at the end",
    body: "User data ends up in one big pile with no row-level security. Fixing it means rewriting half the backend.",
  },
  {
    emoji: "💸",
    title: "AI API bill nobody budgeted for",
    body: "Calling GPT-4 on every request feels fine at 10 users. At 10,000 it's a crisis.",
  },
  {
    emoji: "🇪🇺",
    title: "GDPR discovered after launch",
    body: "You had European users the whole time. The fine risk — and the scramble to add a delete-my-data flow — could've been avoided.",
  },
  {
    emoji: "🏢",
    title: "IT blocks the enterprise sale",
    body: "The stack you chose doesn't support SSO. One deal down, months before you find out why.",
  },
  {
    emoji: "🚀",
    title: "Scaling costs no one planned for",
    body: "Free tiers are great until they aren't. Knowing the ceiling before you build saves a nasty surprise.",
  },
];

function CanopyLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 3C8.5 3 5 6 5 10c0 3 2 5.5 4.5 6.5V19h5v-2.5C17 15.5 19 13 19 10c0-4-3.5-7-7-7z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 19h5M10 22h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M8 5v3l2 2"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
