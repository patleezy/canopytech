"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  SavedBrief,
  SavedAudit,
  loadSavedBriefs,
  removeSavedBrief,
  loadSavedAudits,
  removeSavedAudit,
  formatSavedDate,
} from "@/lib/saved-briefs";

const DismissIcon = () => (
  <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5" aria-hidden="true">
    <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
  </svg>
);

export function SavedBriefBanner() {
  const router = useRouter();
  const [briefs, setBriefs] = useState<SavedBrief[]>([]);

  useEffect(() => {
    setBriefs(loadSavedBriefs());
  }, []);

  if (briefs.length === 0) return null;

  const handleResume = (brief: SavedBrief) => {
    sessionStorage.setItem("canopy_brief", brief.content);
    router.push("/brief");
  };

  const handleDismiss = (id: string) => {
    removeSavedBrief(id);
    setBriefs((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="flex flex-col gap-1.5">
      {briefs.map((brief) => (
        <div
          key={brief.id}
          className="flex items-center justify-between gap-4 px-4 py-3 bg-forest-800 border border-forest-600 rounded-xl text-sm"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-amber-canopy/10 border border-amber-canopy/20 flex items-center justify-center text-base leading-none">
              📋
            </span>
            <div className="min-w-0">
              <p className="text-text-primary font-medium truncate">{brief.projectName}</p>
              <p className="text-xs text-text-muted">Brief · {formatSavedDate(brief.savedAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => handleResume(brief)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-canopy text-forest-950 hover:bg-amber-canopy-light transition-all"
            >
              View
            </button>
            <button
              onClick={() => handleDismiss(brief.id)}
              aria-label="Remove saved brief"
              className="p-1.5 rounded-lg text-text-muted hover:text-text-secondary hover:bg-forest-700 transition-all"
            >
              <DismissIcon />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SavedAuditBanner() {
  const router = useRouter();
  const [audits, setAudits] = useState<SavedAudit[]>([]);

  useEffect(() => {
    setAudits(loadSavedAudits());
  }, []);

  if (audits.length === 0) return null;

  const handleResume = (audit: SavedAudit) => {
    sessionStorage.setItem("canopy_audit", JSON.stringify({ url: audit.repoUrl, content: audit.content }));
    router.push("/audit");
  };

  const handleDismiss = (id: string) => {
    removeSavedAudit(id);
    setAudits((prev) => prev.filter((a) => a.id !== id));
  };

  const repoDisplay = (repoUrl: string) =>
    repoUrl.replace(/^https?:\/\/github\.com\//, "").split("/").slice(0, 2).join("/") || repoUrl;

  return (
    <div className="flex flex-col gap-1.5">
      {audits.map((audit) => (
        <div
          key={audit.id}
          className="flex items-center justify-between gap-4 px-4 py-3 bg-forest-800 border border-forest-600 rounded-xl text-sm"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-amber-canopy/10 border border-amber-canopy/20 flex items-center justify-center">
              <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 text-amber-canopy" aria-hidden="true">
                <path d="M8 3H4a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1v-4M11 2l3 3m0 0L8 11l-3 1 1-3 6-5z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div className="min-w-0">
              <p className="text-text-primary font-medium truncate">{repoDisplay(audit.repoUrl)}</p>
              <p className="text-xs text-text-muted">Audit · {formatSavedDate(audit.savedAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => handleResume(audit)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-canopy text-forest-950 hover:bg-amber-canopy-light transition-all"
            >
              View
            </button>
            <button
              onClick={() => handleDismiss(audit.id)}
              aria-label="Remove saved audit"
              className="p-1.5 rounded-lg text-text-muted hover:text-text-secondary hover:bg-forest-700 transition-all"
            >
              <DismissIcon />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
