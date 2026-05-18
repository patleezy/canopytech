// New plural keys (arrays). Legacy single-item keys are migrated on first load.
const BRIEFS_KEY = "canopy_saved_briefs";
const AUDITS_KEY = "canopy_saved_audits";
const LEGACY_BRIEF_KEY = "canopy_saved_brief";
const LEGACY_AUDIT_KEY = "canopy_saved_audit";

const MAX_SAVED = 10;

export interface SavedBrief {
  id: string;
  savedAt: number;
  projectName: string;
  content: string;
}

export interface SavedAudit {
  id: string;
  savedAt: number;
  repoUrl: string;
  content: string;
}

function extractProjectName(content: string): string {
  const match = content.match(/\*\*Project:\*\*\s*(.+)/);
  if (match?.[1]) return match[1].trim().slice(0, 60);
  return "Untitled project";
}

// ── Briefs ────────────────────────────────────────────────────────────────────

export function saveBrief(content: string): SavedBrief {
  const brief: SavedBrief = {
    id: Math.random().toString(36).slice(2, 9),
    savedAt: Date.now(),
    projectName: extractProjectName(content),
    content,
  };
  try {
    const existing = loadSavedBriefs();
    localStorage.setItem(BRIEFS_KEY, JSON.stringify([brief, ...existing].slice(0, MAX_SAVED)));
  } catch {
    // Storage quota exceeded or unavailable
  }
  return brief;
}

export function loadSavedBriefs(): SavedBrief[] {
  try {
    const raw = localStorage.getItem(BRIEFS_KEY);
    if (raw) return JSON.parse(raw) as SavedBrief[];

    // Migrate legacy single-item key on first access
    const legacy = localStorage.getItem(LEGACY_BRIEF_KEY);
    if (legacy) {
      const items = [JSON.parse(legacy) as SavedBrief];
      localStorage.setItem(BRIEFS_KEY, JSON.stringify(items));
      localStorage.removeItem(LEGACY_BRIEF_KEY);
      return items;
    }
    return [];
  } catch {
    return [];
  }
}

export function removeSavedBrief(id: string): void {
  try {
    const updated = loadSavedBriefs().filter((b) => b.id !== id);
    localStorage.setItem(BRIEFS_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

// ── Audits ────────────────────────────────────────────────────────────────────

export function saveAudit(content: string, repoUrl: string): SavedAudit {
  const audit: SavedAudit = {
    id: Math.random().toString(36).slice(2, 9),
    savedAt: Date.now(),
    repoUrl,
    content,
  };
  try {
    const existing = loadSavedAudits();
    localStorage.setItem(AUDITS_KEY, JSON.stringify([audit, ...existing].slice(0, MAX_SAVED)));
  } catch {
    // Storage quota exceeded or unavailable
  }
  return audit;
}

export function loadSavedAudits(): SavedAudit[] {
  try {
    const raw = localStorage.getItem(AUDITS_KEY);
    if (raw) return JSON.parse(raw) as SavedAudit[];

    // Migrate legacy single-item key on first access
    const legacy = localStorage.getItem(LEGACY_AUDIT_KEY);
    if (legacy) {
      const items = [JSON.parse(legacy) as SavedAudit];
      localStorage.setItem(AUDITS_KEY, JSON.stringify(items));
      localStorage.removeItem(LEGACY_AUDIT_KEY);
      return items;
    }
    return [];
  } catch {
    return [];
  }
}

export function removeSavedAudit(id: string): void {
  try {
    const updated = loadSavedAudits().filter((a) => a.id !== id);
    localStorage.setItem(AUDITS_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

// ── Quick Stacks ──────────────────────────────────────────────────────────────

const QUICK_STACKS_KEY = "canopy_saved_quick_stacks";

export interface SavedQuickStack {
  id: string;
  savedAt: number;
  description: string;
  content: string;
}

export function saveQuickStack(description: string, content: string): SavedQuickStack {
  const item: SavedQuickStack = {
    id: Math.random().toString(36).slice(2, 9),
    savedAt: Date.now(),
    description: description.slice(0, 80),
    content,
  };
  try {
    const existing = loadSavedQuickStacks();
    localStorage.setItem(QUICK_STACKS_KEY, JSON.stringify([item, ...existing].slice(0, MAX_SAVED)));
  } catch {
    // Storage quota exceeded or unavailable
  }
  return item;
}

export function loadSavedQuickStacks(): SavedQuickStack[] {
  try {
    const raw = localStorage.getItem(QUICK_STACKS_KEY);
    return raw ? (JSON.parse(raw) as SavedQuickStack[]) : [];
  } catch {
    return [];
  }
}

export function removeSavedQuickStack(id: string): void {
  try {
    const updated = loadSavedQuickStacks().filter((s) => s.id !== id);
    localStorage.setItem(QUICK_STACKS_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

// ── Shared ────────────────────────────────────────────────────────────────────

export function formatSavedDate(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
