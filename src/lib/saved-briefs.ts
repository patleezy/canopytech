const STORAGE_KEY = "canopy_saved_brief";
const AUDIT_STORAGE_KEY = "canopy_saved_audit";

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

export function saveBrief(content: string): SavedBrief {
  const brief: SavedBrief = {
    id: Math.random().toString(36).slice(2, 9),
    savedAt: Date.now(),
    projectName: extractProjectName(content),
    content,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(brief));
  } catch {
    // Storage quota exceeded or unavailable
  }
  return brief;
}

export function loadSavedBrief(): SavedBrief | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedBrief;
  } catch {
    return null;
  }
}

export function clearSavedBrief(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function saveAudit(content: string, repoUrl: string): SavedAudit {
  const audit: SavedAudit = {
    id: Math.random().toString(36).slice(2, 9),
    savedAt: Date.now(),
    repoUrl,
    content,
  };
  try {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(audit));
  } catch {
    // Storage quota exceeded or unavailable
  }
  return audit;
}

export function loadSavedAudit(): SavedAudit | null {
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedAudit;
  } catch {
    return null;
  }
}

export function clearSavedAudit(): void {
  try {
    localStorage.removeItem(AUDIT_STORAGE_KEY);
  } catch {
    // ignore
  }
}

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
