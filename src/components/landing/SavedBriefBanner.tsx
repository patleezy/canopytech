"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadSavedBrief, clearSavedBrief, formatSavedDate } from "@/lib/saved-briefs";

export function SavedBriefBanner() {
  const router = useRouter();
  const [brief, setBrief] = useState<{ projectName: string; savedAt: number; content: string } | null>(null);

  useEffect(() => {
    setBrief(loadSavedBrief());
  }, []);

  if (!brief) return null;

  const handleResume = () => {
    sessionStorage.setItem("canopy_brief", brief.content);
    router.push("/brief");
  };

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 bg-forest-800 border border-forest-600 rounded-xl text-sm">
      <div className="flex items-center gap-3 min-w-0">
        <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-amber-canopy/10 border border-amber-canopy/20 flex items-center justify-center text-base leading-none">
          📋
        </span>
        <div className="min-w-0">
          <p className="text-text-primary font-medium truncate">
            {brief.projectName}
          </p>
          <p className="text-xs text-text-muted">
            Saved brief · {formatSavedDate(brief.savedAt)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={handleResume}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-canopy text-forest-950 hover:bg-amber-canopy-light transition-all"
        >
          View brief
        </button>
        <button
          onClick={() => { clearSavedBrief(); setBrief(null); }}
          aria-label="Dismiss saved brief"
          className="p-1.5 rounded-lg text-text-muted hover:text-text-secondary hover:bg-forest-700 transition-all"
        >
          <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5" aria-hidden="true">
            <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
