"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { cn } from "@/lib/utils";

// ── Utilities ────────────────────────────────────────────────────────────────

export function toSlug(text: string): string {
  return text
    .replace(/\p{Emoji}/gu, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function extractText(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(extractText).join("");
  if (
    children !== null &&
    typeof children === "object" &&
    "props" in (children as object)
  ) {
    return extractText((children as { props: { children: React.ReactNode } }).props.children);
  }
  return "";
}

// ── Section parsing (used by the brief page for chip nav) ───────────────────

export function parseSections(
  content: string
): { title: string; slug: string }[] {
  const results: { title: string; slug: string }[] = [];
  const lines = content.split("\n");
  for (const line of lines) {
    if (line.startsWith("#### ")) {
      const title = line.replace(/^####\s+/, "").trim();
      results.push({ title, slug: toSlug(title) });
    }
  }
  return results;
}

// ── Copy button ──────────────────────────────────────────────────────────────

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  };

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? "Copied!" : label}
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-canopy",
        copied
          ? "bg-forest-600 text-amber-canopy"
          : "bg-forest-700 text-text-muted hover:text-text-primary hover:bg-forest-600 border border-forest-600"
      )}
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
          {label}
        </>
      )}
    </button>
  );
}

// ── Markdown components ──────────────────────────────────────────────────────

const components: Components = {
  h3: ({ children }) => {
    const text = extractText(children);
    const id = toSlug(text);
    return (
      <h3
        id={id}
        className="text-lg font-semibold text-text-primary mt-8 mb-3 pb-2 border-b border-forest-600 scroll-mt-20"
      >
        {children}
      </h3>
    );
  },

  h4: ({ children }) => {
    const text = extractText(children);
    const id = toSlug(text);
    return (
      <h4
        id={id}
        className="text-xs font-bold text-text-secondary uppercase tracking-wider mt-6 mb-2 scroll-mt-24"
      >
        {children}
      </h4>
    );
  },

  p: ({ children }) => (
    <p className="text-text-secondary leading-relaxed mb-3">{children}</p>
  ),

  ul: ({ children }) => <ul className="mb-4 flex flex-col gap-1">{children}</ul>,

  li: ({ children }) => (
    <li className="text-text-secondary pl-4 relative before:absolute before:left-0 before:content-['–'] before:text-amber-canopy">
      {children}
    </li>
  ),

  table: ({ children }) => (
    <div className="overflow-x-auto mb-6 rounded-xl border border-forest-600">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-forest-800">{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => (
    <tr className="border-b border-forest-700 last:border-0 even:bg-forest-900/60">
      {children}
    </tr>
  ),
  th: ({ children }) => (
    <th className="px-3 py-2.5 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2.5 text-text-primary align-top leading-relaxed">
      {children}
    </td>
  ),

  // Code blocks get a copy button + special treatment for system prompts
  pre: ({ children }) => {
    const codeEl = children as React.ReactElement<{ children: string; className?: string }>;
    const rawText =
      typeof codeEl?.props?.children === "string"
        ? codeEl.props.children
        : "";
    const isSystemPrompt = rawText.includes("COPY THIS INTO");
    const copyLabel = isSystemPrompt ? "Copy system prompt" : "Copy";

    return (
      <div className="relative mb-4 group">
        {/* Copy button overlay */}
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <CopyButton text={rawText} label={copyLabel} />
        </div>
        <pre className="bg-forest-900 border border-forest-600 rounded-xl px-4 py-3 overflow-x-auto text-xs leading-relaxed">
          {children}
        </pre>
      </div>
    );
  },

  code: ({ children, className }) => {
    const isBlock = Boolean(className?.includes("language-"));
    if (isBlock) {
      return (
        <code className="block text-text-secondary text-xs font-mono leading-relaxed whitespace-pre-wrap">
          {children}
        </code>
      );
    }
    return (
      <code className="bg-forest-800 border border-forest-600 px-1.5 py-0.5 rounded text-amber-canopy text-xs font-mono">
        {children}
      </code>
    );
  },

  hr: () => <hr className="border-forest-700 my-6" />,

  strong: ({ children }) => (
    <strong className="font-semibold text-text-primary">{children}</strong>
  ),

  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-amber-canopy pl-4 my-3 text-text-secondary italic">
      {children}
    </blockquote>
  ),
};

// ── Main component ───────────────────────────────────────────────────────────

interface BriefRendererProps {
  content: string;
}

export function BriefRenderer({ content }: BriefRendererProps) {
  return (
    <div className="brief-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
