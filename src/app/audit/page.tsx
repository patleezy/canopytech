"use client";

import { useState, useRef } from "react";
import { BriefRenderer } from "@/components/brief/BriefRenderer";

type Phase = "idle" | "loading" | "done" | "error";

function CanopyLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
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

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-forest-700 border border-forest-600 text-text-muted hover:text-text-primary hover:bg-forest-600 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-canopy"
    >
      {copied ? (
        <>
          <svg viewBox="0 0 12 10" fill="none" className="w-3 h-2.5" aria-hidden="true">
            <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3" aria-hidden="true">
            <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
            <path d="M10 4V2.5A1.5 1.5 0 008.5 1H2.5A1.5 1.5 0 001 2.5v6A1.5 1.5 0 002.5 10H4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
          </svg>
          Copy report
        </>
      )}
    </button>
  );
}

export default function AuditPage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [url, setUrl] = useState("");
  const [report, setReport] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const isSubmitting = useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting.current || !url.trim()) return;
    isSubmitting.current = true;
    setPhase("loading");
    setReport("");
    setErrorMsg("");

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: url.trim() }),
      });

      if (!res.ok) {
        const text = await res.text();
        setErrorMsg(text || "Something went wrong. Please try again.");
        setPhase("error");
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          setReport(accumulated);
        }
      }

      setPhase("done");
    } catch {
      setErrorMsg("Network error — please check your connection and try again.");
      setPhase("error");
    } finally {
      isSubmitting.current = false;
    }
  };

  const handleReset = () => {
    setPhase("idle");
    setUrl("");
    setReport("");
    setErrorMsg("");
  };

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
        <span className="text-xs text-text-muted">Repo Audit</span>
      </header>

      <div className="flex-1 flex items-start justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-2xl">

          {/* ── Idle: form ─────────────────────────────────────────────────────── */}
          {phase === "idle" && (
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-amber-canopy uppercase tracking-widest">
                  Audit Existing Project
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
                  Get a readiness report
                </h1>
                <p className="text-text-secondary leading-relaxed">
                  Paste a public GitHub URL. We&apos;ll fetch the repo metadata and generate an honest assessment of your stack, security posture, and top improvements.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="repo-url"
                    className="text-sm font-medium text-text-secondary"
                  >
                    GitHub repository URL
                  </label>
                  <input
                    id="repo-url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://github.com/owner/repo"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-forest-800 border border-forest-600 text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-amber-canopy/60 focus:ring-2 focus:ring-amber-canopy/20 transition-all"
                  />
                  <p className="text-xs text-text-muted">
                    Works with any public GitHub repository
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={!url.trim()}
                  className="self-start flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-canopy text-forest-950 text-sm font-semibold transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-canopy"
                >
                  Audit this repo
                  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" aria-hidden="true">
                    <path d="M4 8h8M8 4l4 4-4 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </form>
            </div>
          )}

          {/* ── Loading: spinner + live streaming preview ───────────────────────── */}
          {(phase === "loading") && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-forest-600 border-t-amber-canopy animate-spin flex-shrink-0" />
                <span className="text-sm text-text-secondary">
                  {report.length === 0 ? "Fetching repo…" : "Analyzing…"}
                </span>
              </div>
              {report.length > 0 && (
                <div className="opacity-70">
                  <BriefRenderer content={report} />
                </div>
              )}
            </div>
          )}

          {/* ── Done: full report ───────────────────────────────────────────────── */}
          {phase === "done" && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <p className="text-xs font-semibold text-amber-canopy uppercase tracking-widest">
                  Audit complete
                </p>
                <div className="flex items-center gap-2">
                  <CopyButton text={report} />
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-forest-700 border border-forest-600 text-text-muted hover:text-text-primary hover:bg-forest-600 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-canopy"
                  >
                    Audit another repo
                  </button>
                </div>
              </div>
              <BriefRenderer content={report} />
            </div>
          )}

          {/* ── Error ──────────────────────────────────────────────────────────── */}
          {phase === "error" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2 p-4 rounded-xl bg-forest-800 border border-red-900/60">
                <p className="text-sm font-semibold text-red-400">Audit failed</p>
                <p className="text-sm text-text-secondary">{errorMsg}</p>
              </div>
              <button
                onClick={handleReset}
                className="self-start flex items-center gap-2 px-4 py-2 rounded-xl bg-forest-700 border border-forest-600 text-sm font-medium text-text-secondary hover:text-text-primary transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-canopy"
              >
                Try again
              </button>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
