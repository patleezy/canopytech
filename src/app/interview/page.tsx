import type { Metadata } from "next";
import { InterviewShell } from "@/components/interview/InterviewShell";

export const metadata: Metadata = {
  title: "New Project — Canopy Tech",
  description: "Answer a few questions and get your personalized architecture brief.",
};

export default function InterviewPage() {
  return (
    <main className="min-h-screen bg-forest-950 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-forest-700">
        <a href="/" className="flex items-center gap-2 group">
          <CanopyLogo className="w-6 h-6 text-amber-canopy" />
          <span className="text-sm font-semibold text-text-primary tracking-tight">
            Canopy Tech
          </span>
        </a>
        <span className="text-xs text-text-muted">Pre-Build Interview</span>
      </header>

      {/* Interview content */}
      <div className="flex-1 flex items-start justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-xl">
          <InterviewShell />
        </div>
      </div>
    </main>
  );
}

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
