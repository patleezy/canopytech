"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BriefRenderer } from "@/components/brief/BriefRenderer";

export default function BriefPage() {
  const router = useRouter();
  const [brief, setBrief] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("canopy_brief");
    if (!stored) {
      router.replace("/");
      return;
    }
    setBrief(stored);
  }, [router]);

  if (!brief) {
    return (
      <div className="min-h-screen bg-forest-950 flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-forest-600 border-t-amber-canopy animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-forest-950 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-forest-700 sticky top-0 bg-forest-950/95 backdrop-blur-sm z-10">
        <a href="/" className="flex items-center gap-2">
          <CanopyLogo className="w-6 h-6 text-amber-canopy" />
          <span className="text-sm font-semibold text-text-primary tracking-tight">
            Canopy Tech
          </span>
        </a>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const text = brief;
              navigator.clipboard.writeText(text).catch(() => {});
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-text-secondary border border-forest-600 hover:bg-forest-700 hover:text-text-primary transition-all"
          >
            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" aria-hidden="true">
              <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
              <path d="M11 5V3.5A1.5 1.5 0 009.5 2H3.5A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
            </svg>
            Copy
          </button>
          <a
            href="/interview"
            onClick={() => sessionStorage.removeItem("canopy_brief")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-canopy text-forest-950 hover:bg-amber-canopy-light transition-all"
          >
            New Project
          </a>
        </div>
      </header>

      {/* Brief content */}
      <div className="flex-1 flex justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-3xl">
          {/* Brief card */}
          <div className="bg-forest-900 border border-forest-700 rounded-2xl p-6 sm:p-8 shadow-xl">
            <BriefRenderer content={brief} />
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-forest-800 border border-forest-600 rounded-xl">
            <div>
              <p className="text-sm font-medium text-text-primary">Ready to start building?</p>
              <p className="text-xs text-text-muted mt-0.5">Copy your vibe coding system prompt above and paste it into your AI tool.</p>
            </div>
            <a
              href="/interview"
              onClick={() => sessionStorage.removeItem("canopy_brief")}
              className="flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold bg-amber-canopy text-forest-950 hover:bg-amber-canopy-light transition-all shadow-[0_1px_8px_rgba(217,119,6,0.3)]"
            >
              Start another project
            </a>
          </div>
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
