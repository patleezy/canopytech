"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

interface BriefRendererProps {
  content: string;
}

const components: Components = {
  // Headings
  h3: ({ children }) => (
    <h3 className="text-lg font-semibold text-text-primary mt-8 mb-3 pb-2 border-b border-forest-600">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mt-6 mb-2">
      {children}
    </h4>
  ),
  // Paragraphs
  p: ({ children }) => (
    <p className="text-text-secondary leading-relaxed mb-3">{children}</p>
  ),
  // Lists
  ul: ({ children }) => (
    <ul className="mb-4 flex flex-col gap-1">{children}</ul>
  ),
  li: ({ children }) => (
    <li className="text-text-secondary pl-4 relative before:absolute before:left-0 before:content-['–'] before:text-amber-canopy">
      {children}
    </li>
  ),
  // Tables
  table: ({ children }) => (
    <div className="overflow-x-auto mb-6 rounded-xl border border-forest-600">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-forest-800">{children}</thead>
  ),
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => (
    <tr className="border-b border-forest-600 last:border-0 even:bg-forest-900/50">
      {children}
    </tr>
  ),
  th: ({ children }) => (
    <th className="px-3 py-2.5 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2.5 text-text-primary align-top leading-relaxed">
      {children}
    </td>
  ),
  // Code
  code: ({ children, className }) => {
    const isBlock = className?.includes("language-");
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
  pre: ({ children }) => (
    <pre className="bg-forest-900 border border-forest-600 rounded-xl px-4 py-3 overflow-x-auto mb-4 text-xs leading-relaxed">
      {children}
    </pre>
  ),
  // Horizontal rule
  hr: () => <hr className="border-forest-600 my-6" />,
  // Strong
  strong: ({ children }) => (
    <strong className="font-semibold text-text-primary">{children}</strong>
  ),
  // Blockquote (used for flags)
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-amber-canopy pl-4 my-3 text-text-secondary italic">
      {children}
    </blockquote>
  ),
};

export function BriefRenderer({ content }: BriefRendererProps) {
  return (
    <div className="brief-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
