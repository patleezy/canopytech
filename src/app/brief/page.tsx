"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { BriefRenderer, parseSections, toSlug } from "@/components/brief/BriefRenderer";
import { saveBrief } from "@/lib/saved-briefs";
import { cn } from "@/lib/utils";

// ── Export helpers ───────────────────────────────────────────────────────────

function downloadText(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function openEmail(content: string) {
  const subject = encodeURIComponent("My Canopy Tech Project Brief");
  // Email body: truncate to ~1 800 chars to stay under mailto URI limits
  const bodyText = content.length > 1_800
    ? content.slice(0, 1_800) + "\n\n[Brief truncated — copy the full version from canopytech.app]"
    : content;
  const body = encodeURIComponent(bodyText);
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

function triggerPrint() {
  window.print();
}

// ── Copy button ──────────────────────────────────────────────────────────────

function CopyButton({ content, label = "Copy" }: { content: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(content).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-canopy",
        copied
          ? "border-amber-canopy text-amber-canopy bg-amber-canopy/10"
          : "border-forest-600 text-text-secondary hover:bg-forest-700 hover:text-text-primary"
      )}
    >
      {copied ? "✓ Copied" : label}
    </button>
  );
}

// ── Export dropdown ──────────────────────────────────────────────────────────

function ExportMenu({ content, projectName }: { content: string; projectName: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const slug = projectName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 40);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-canopy",
          "border-forest-600 text-text-secondary hover:bg-forest-700 hover:text-text-primary"
        )}
      >
        Export
        <svg viewBox="0 0 12 12" fill="none" className={cn("w-3 h-3 transition-transform", open && "rotate-180")} aria-hidden="true">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-9 z-30 w-48 rounded-xl bg-forest-800 border border-forest-600 shadow-xl overflow-hidden py-1"
        >
          {[
            {
              label: "Download as .txt",
              icon: "📄",
              action: () => { downloadText(content, `canopy-brief-${slug}.txt`); setOpen(false); },
            },
            {
              label: "Export to PDF",
              icon: "🖨️",
              action: () => { triggerPrint(); setOpen(false); },
            },
            {
              label: "Send via email",
              icon: "✉️",
              action: () => { openEmail(content); setOpen(false); },
            },
          ].map((item) => (
            <button
              key={item.label}
              role="menuitem"
              onClick={item.action}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-text-secondary hover:bg-forest-700 hover:text-text-primary transition-colors text-left"
            >
              <span className="text-sm leading-none">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Anchor chip nav ──────────────────────────────────────────────────────────

function AnchorChips({ sections }: { sections: { title: string; slug: string }[] }) {
  const [active, setActive] = useState(sections[0]?.slug ?? "");

  useEffect(() => {
    if (sections.length === 0) return;
    const headings = sections.map(({ slug }) => document.getElementById(slug)).filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  if (sections.length === 0) return null;

  return (
    <nav
      aria-label="Brief sections"
      className="brief-nav-chips flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none"
    >
      {sections.map(({ title, slug }) => {
        // Strip emojis for chip label brevity
        const label = title.replace(/\p{Emoji}/gu, "").trim();
        return (
          <a
            key={slug}
            href={`#${slug}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(slug)?.scrollIntoView({ behavior: "smooth", block: "start" });
              setActive(slug);
            }}
            className={cn(
              "flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all border",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-canopy",
              active === slug
                ? "bg-amber-canopy text-forest-950 border-amber-canopy"
                : "bg-forest-800 text-text-secondary border-forest-600 hover:border-forest-500 hover:text-text-primary"
            )}
          >
            {label}
          </a>
        );
      })}
    </nav>
  );
}

// ── Save button ──────────────────────────────────────────────────────────────

function SaveButton({ content }: { content: string }) {
  const [saved, setSaved] = useState(false);

  return (
    <button
      onClick={() => {
        saveBrief(content);
        setSaved(true);
      }}
      disabled={saved}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-canopy",
        saved
          ? "border-amber-canopy text-amber-canopy bg-amber-canopy/10 cursor-default"
          : "border-forest-600 text-text-secondary hover:bg-forest-700 hover:text-text-primary"
      )}
    >
      {saved ? "✓ Saved" : "Save brief"}
    </button>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function BriefPage() {
  const router = useRouter();
  const [brief, setBrief] = useState<string | null>(null);
  const [sections, setSections] = useState<{ title: string; slug: string }[]>([]);
  const [projectName, setProjectName] = useState("My Project");

  useEffect(() => {
    const stored = sessionStorage.getItem("canopy_brief");
    if (!stored) {
      router.replace("/");
      return;
    }
    setBrief(stored);
    setSections(parseSections(stored));

    const match = stored.match(/\*\*Project:\*\*\s*(.+)/);
    if (match?.[1]) setProjectName(match[1].trim().slice(0, 60));
  }, [router]);

  if (!brief) {
    return (
      <div className="min-h-screen bg-forest-950 flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-forest-600 border-t-amber-canopy animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-forest-950 flex flex-col print:bg-white">
      {/* ── Sticky header ──────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 bg-forest-950/95 backdrop-blur-sm border-b border-forest-800 print:hidden">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3">
          <a href="/" className="flex items-center gap-2">
            <CanopyLogo className="w-5 h-5 text-amber-canopy" />
            <span className="text-sm font-semibold text-text-primary tracking-tight hidden sm:block">
              Canopy Tech
            </span>
          </a>

          {/* Action bar */}
          <div className="brief-export-bar flex items-center gap-2">
            <CopyButton content={brief} label="Copy all" />
            <SaveButton content={brief} />
            <ExportMenu content={brief} projectName={projectName} />
            <a
              href="/interview"
              onClick={() => sessionStorage.removeItem("canopy_brief")}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-canopy text-forest-950 hover:bg-amber-canopy-light transition-all"
            >
              New project
            </a>
          </div>
        </div>

        {/* Anchor chip navigation */}
        <div className="px-4 sm:px-6 pb-2.5">
          <AnchorChips sections={sections} />
        </div>
      </header>

      {/* ── Brief content ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex justify-center px-4 py-8 sm:py-10">
        <div className="w-full max-w-3xl">
          {/* Print header (shown only when printing) */}
          <div className="hidden print:block mb-8">
            <p className="text-lg font-bold">Canopy Tech — Project Brief</p>
            <p className="text-sm text-gray-500">canopytech.app · Generated {new Date().toLocaleDateString()}</p>
          </div>

          <div className="brief-card bg-forest-900 border border-forest-700 rounded-2xl p-5 sm:p-8 shadow-xl print:shadow-none">
            <BriefRenderer content={brief} />
          </div>

          {/* CTA footer */}
          <div className="brief-cta-footer mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-forest-800 border border-forest-700 rounded-xl print:hidden">
            <div>
              <p className="text-sm font-medium text-text-primary">
                Ready to start building?
              </p>
              <p className="text-xs text-text-muted mt-0.5">
                Copy your vibe coding system prompt above and paste it into your AI tool.
              </p>
            </div>
            <a
              href="/interview"
              onClick={() => sessionStorage.removeItem("canopy_brief")}
              className="flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold bg-amber-canopy text-forest-950 hover:bg-amber-canopy-light transition-all"
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
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 3C8.5 3 5 6 5 10c0 3 2 5.5 4.5 6.5V19h5v-2.5C17 15.5 19 13 19 10c0-4-3.5-7-7-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 19h5M10 22h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
