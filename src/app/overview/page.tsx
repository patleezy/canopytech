import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Overview — Canopy Tech",
  description:
    "How Canopy Tech works, what each tool produces, and a sample of the output you'll get.",
};

export default function OverviewPage() {
  return (
    <main className="min-h-screen bg-forest-950 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-forest-700">
        <a href="/" className="flex items-center gap-2">
          <CanopyLogo className="w-6 h-6 text-amber-canopy" />
          <span className="text-sm font-semibold text-text-primary tracking-tight">
            Canopy Tech
          </span>
        </a>
        <span className="text-xs text-text-muted">Overview</span>
      </header>

      <div className="flex-1 flex justify-center px-4">
        <div className="w-full max-w-3xl flex flex-col gap-20 py-14 sm:py-20">

          {/* ── Hero ──────────────────────────────────────────────────────────── */}
          <section className="flex flex-col gap-4 max-w-2xl">
            <h1
              className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(to bottom, #f5faf7 0%, #c8ddd5 100%)" }}
            >
              How Canopy works
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed">
              Canopy asks the architecture questions your future CTO would ask — before
              you write a line of code. Three tools, each built for a different moment
              in your build process.
            </p>
          </section>

          {/* ── How it works — 3 steps ────────────────────────────────────────── */}
          <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-xs font-semibold text-amber-canopy uppercase tracking-wider">
                How it works
              </h2>
              <p className="text-sm text-text-muted">From idea to ready-to-build brief in three steps.</p>
            </div>

            <div className="flex flex-col gap-4">
              {HOW_IT_WORKS.map((step, i) => (
                <div key={step.title} className="flex gap-5 p-5 rounded-xl bg-forest-900 border border-forest-700">
                  <div className="flex-shrink-0 flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-canopy/10 border border-amber-canopy/30 flex items-center justify-center text-sm font-bold text-amber-canopy">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    {i < HOW_IT_WORKS.length - 1 && (
                      <div className="w-px flex-1 min-h-[24px] bg-forest-700" />
                    )}
                  </div>
                  <div className="flex flex-col gap-1 pb-2">
                    <p className="text-sm font-semibold text-text-primary">{step.title}</p>
                    <p className="text-xs text-text-secondary leading-relaxed">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Who it's for ──────────────────────────────────────────────────── */}
          <section className="flex flex-col gap-6">
            <h2 className="text-xs font-semibold text-amber-canopy uppercase tracking-wider">
              Who it&apos;s for
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PERSONAS.map((p) => (
                <div key={p.label} className="flex flex-col gap-2 p-5 rounded-xl bg-forest-900 border border-forest-700">
                  <p className="text-sm font-semibold text-text-primary">{p.label}</p>
                  <p className="text-xs text-text-secondary leading-relaxed">{p.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Three tools ───────────────────────────────────────────────────── */}
          <section className="flex flex-col gap-6">
            <h2 className="text-xs font-semibold text-amber-canopy uppercase tracking-wider">
              The three tools
            </h2>

            <div className="flex flex-col gap-4">
              {/* Quick Stack */}
              <div className="flex flex-col gap-4 p-6 rounded-2xl bg-forest-900 border border-forest-700">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-semibold text-text-primary">Quick Stack</span>
                    <span className="text-xs text-text-muted">~30 seconds</span>
                  </div>
                  <Link
                    href="/quick"
                    className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-canopy text-forest-950 hover:bg-amber-canopy-light transition-all"
                  >
                    Try it
                  </Link>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  <span className="text-text-primary font-medium">For:</span> Developers who want a
                  stack direction before committing to a full interview. Good for quick gut-checks,
                  side projects, and hackathons.
                </p>
                <div className="flex flex-col gap-1.5">
                  <p className="text-xs font-medium text-text-muted uppercase tracking-wide">You get</p>
                  <ul className="flex flex-col gap-1">
                    {[
                      "Six stack cards — Frontend, Backend, Database, Auth, Styling, Deployment",
                      "One-line rationale per card, tuned to your description",
                      "A prompt to take the full consultation for more depth",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="text-amber-canopy mt-px flex-shrink-0">–</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Full Consultation */}
              <div className="flex flex-col gap-4 p-6 rounded-2xl bg-forest-900 border border-forest-700">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-semibold text-text-primary">Full Consultation</span>
                    <span className="text-xs text-text-muted">~5 minutes</span>
                  </div>
                  <Link
                    href="/interview"
                    className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-canopy text-forest-950 hover:bg-amber-canopy-light transition-all"
                  >
                    Try it
                  </Link>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  <span className="text-text-primary font-medium">For:</span> Founders and builders
                  starting a project they intend to ship. 18 questions across 5 layers surface
                  everything a principal architect would want to know upfront.
                </p>
                <div className="flex flex-col gap-1.5">
                  <p className="text-xs font-medium text-text-muted uppercase tracking-wide">You get</p>
                  <ul className="flex flex-col gap-1">
                    {[
                      "Full stack table with primary recommendation + alternative per layer",
                      "Monthly cost estimate including free-tier ceilings and viral-growth scenarios",
                      "Compliance flags — GDPR, HIPAA, COPPA — triggered automatically from your answers",
                      "Corporate readiness score across 5 dimensions (auth, data isolation, compliance, observability, API contracts)",
                      "A ready-to-paste vibe coding system prompt for Cursor, Claude, Windsurf, or your tool of choice",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="text-amber-canopy mt-px flex-shrink-0">–</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Audit */}
              <div className="flex flex-col gap-4 p-6 rounded-2xl bg-forest-900 border border-forest-700">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-semibold text-text-primary">Repo Audit</span>
                    <span className="text-xs text-text-muted">~30 seconds</span>
                  </div>
                  <Link
                    href="/audit"
                    className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-canopy text-forest-950 hover:bg-amber-canopy-light transition-all"
                  >
                    Try it
                  </Link>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  <span className="text-text-primary font-medium">For:</span> Builders with an
                  existing project who want an honest read on how production-ready their stack is.
                  Submit a GitHub URL or paste your code directly.
                </p>
                <div className="flex flex-col gap-1.5">
                  <p className="text-xs font-medium text-text-muted uppercase tracking-wide">You get</p>
                  <ul className="flex flex-col gap-1">
                    {[
                      "Architecture assessment against the same 5-layer framework",
                      "Specific gaps identified — missing auth, no RLS, unhandled scale risks",
                      "Prioritised fix list ordered by severity",
                      "Upgrade recommendations where applicable",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="text-amber-canopy mt-px flex-shrink-0">–</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* ── How the Full Consultation works ───────────────────────────────── */}
          <section className="flex flex-col gap-6">
            <h2 className="text-xs font-semibold text-amber-canopy uppercase tracking-wider">
              How the Full Consultation works
            </h2>

            <div className="flex flex-col gap-3">
              {CONSULTATION_STEPS.map((step, i) => (
                <div key={step.layer} className="flex gap-4 p-5 rounded-xl bg-forest-900 border border-forest-700">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-forest-800 border border-forest-600 flex items-center justify-center text-xs font-bold text-amber-canopy">
                    {i + 1}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-semibold text-text-primary">{step.layer}</p>
                    <p className="text-xs text-text-secondary leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
              <div className="flex gap-4 p-5 rounded-xl bg-forest-800 border border-amber-canopy/20">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-canopy/10 border border-amber-canopy/30 flex items-center justify-center text-xs font-bold text-amber-canopy">
                  ✓
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-semibold text-text-primary">Brief generated</p>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Your answers go to Claude with a structured prompt. The brief streams back
                    in seconds — you can copy, share, download as PDF, or paste the system
                    prompt straight into your AI coding tool.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── Sample brief excerpt ──────────────────────────────────────────── */}
          <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-xs font-semibold text-amber-canopy uppercase tracking-wider">
                Sample output
              </h2>
              <p className="text-sm text-text-muted">
                A trimmed excerpt from a real Full Consultation brief.
              </p>
            </div>

            <div className="rounded-2xl bg-forest-900 border border-forest-700 overflow-hidden">
              {/* Brief header */}
              <div className="px-5 py-4 border-b border-forest-700 bg-forest-800">
                <p className="text-xs font-bold text-text-primary">🏗️ CANOPY TECH — PROJECT BRIEF</p>
                <p className="text-xs text-text-muted mt-1">
                  <span className="text-text-secondary font-medium">Project:</span> Personal finance tracker with budget visualisations
                  &nbsp;·&nbsp;
                  <span className="text-text-secondary font-medium">Mode:</span> Pre-Build
                </p>
              </div>

              <div className="p-5 flex flex-col gap-6">
                {/* Stack table */}
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-bold text-text-muted uppercase tracking-wider">
                    Your Recommended Stack
                  </p>
                  <div className="overflow-x-auto rounded-lg border border-forest-700">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-forest-800">
                          <th className="text-left px-3 py-2 text-text-muted font-semibold uppercase tracking-wide">Layer</th>
                          <th className="text-left px-3 py-2 text-text-muted font-semibold uppercase tracking-wide">Recommendation</th>
                          <th className="text-left px-3 py-2 text-text-muted font-semibold uppercase tracking-wide hidden sm:table-cell">Alternative</th>
                          <th className="text-left px-3 py-2 text-text-muted font-semibold uppercase tracking-wide hidden md:table-cell">Why</th>
                        </tr>
                      </thead>
                      <tbody>
                        {SAMPLE_STACK.map((row, i) => (
                          <tr key={row.layer} className={i % 2 === 1 ? "bg-forest-950/40" : ""}>
                            <td className="px-3 py-2.5 text-text-secondary font-medium whitespace-nowrap">{row.layer}</td>
                            <td className="px-3 py-2.5 text-text-primary font-medium whitespace-nowrap">{row.recommendation}</td>
                            <td className="px-3 py-2.5 text-text-muted hidden sm:table-cell whitespace-nowrap">{row.alternative}</td>
                            <td className="px-3 py-2.5 text-text-secondary hidden md:table-cell">{row.why}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Flags */}
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-bold text-text-muted uppercase tracking-wider">
                    ⚠️ Flags &amp; Watch-outs
                  </p>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start gap-2.5 p-3 rounded-lg bg-forest-800 border border-forest-600">
                      <span className="text-xs font-bold text-amber-canopy flex-shrink-0 mt-px">GDPR</span>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        You mentioned European users. You&apos;ll need a privacy policy and a
                        delete-my-data endpoint before launch. Add a{" "}
                        <span className="text-text-primary font-mono">/api/account/delete</span> route
                        that wipes all rows associated with the user&apos;s ID.
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5 p-3 rounded-lg bg-forest-800 border border-forest-600">
                      <span className="text-xs font-bold text-amber-canopy flex-shrink-0 mt-px">COST</span>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        AI is a core feature. At 10,000 users calling your categorisation endpoint
                        daily, you&apos;re looking at ~$400/month in inference costs. Add rate
                        limiting per user from day one.
                      </p>
                    </div>
                  </div>
                </div>

                {/* System prompt snippet */}
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-bold text-text-muted uppercase tracking-wider">
                    🤖 Your Vibe Coding System Prompt
                  </p>
                  <pre className="text-xs text-text-secondary leading-relaxed bg-forest-950 border border-forest-700 rounded-lg p-4 overflow-x-auto font-mono">
{`COPY THIS INTO CURSOR:

You are building a personal finance tracker.

STACK:
- Frontend: Next.js 15 + TypeScript
- Auth: Clerk (free tier, 10K MAU)
- Database: Supabase Postgres with RLS
- AI: Claude claude-haiku-4-5-20251001 for categorisation
- Hosting: Vercel

RULES:
- Every database query must use RLS — never bypass with service key on client
- Rate-limit AI calls to 20/user/day using Upstash Redis
- All money values stored as integers (cents), never floats

NEVER:
- Store raw API keys in the frontend
- Skip input validation on transaction amounts`}
                  </pre>
                </div>

                <p className="text-xs text-text-muted italic">
                  The full brief also includes an estimated monthly cost breakdown and a 5-dimension corporate readiness score.
                </p>
              </div>
            </div>
          </section>

          {/* ── What Canopy covers that others don't ─────────────────────────── */}
          <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-xs font-semibold text-amber-canopy uppercase tracking-wider">
                What Canopy covers that others don&apos;t
              </h2>
              <p className="text-sm text-text-muted">
                Scaffold generators give you files. Canopy gives you a plan — before the files, and after.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DIFFERENTIATORS.map((d) => (
                <div key={d.title} className="flex gap-4 p-5 rounded-xl bg-forest-900 border border-forest-700">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-forest-800 border border-forest-600 flex items-center justify-center text-base">
                    {d.emoji}
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-text-primary">{d.title}</p>
                    <p className="text-xs text-text-secondary leading-relaxed">{d.body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison mini-table */}
            <div className="rounded-xl bg-forest-900 border border-forest-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-forest-800">
                      <th className="text-left px-4 py-2.5 text-text-muted font-semibold uppercase tracking-wide"></th>
                      <th className="text-center px-4 py-2.5 text-text-muted font-semibold uppercase tracking-wide">Quick Stack</th>
                      <th className="text-center px-4 py-2.5 text-text-muted font-semibold uppercase tracking-wide">Full Consult</th>
                      <th className="text-center px-4 py-2.5 text-text-muted font-semibold uppercase tracking-wide">Repo Audit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON_ROWS.map((row, i) => (
                      <tr key={row.feature} className={i % 2 === 1 ? "bg-forest-950/40" : ""}>
                        <td className="px-4 py-2.5 text-text-secondary font-medium">{row.feature}</td>
                        <td className="px-4 py-2.5 text-center">{row.quick ? <span className="text-amber-canopy">✓</span> : <span className="text-text-muted">—</span>}</td>
                        <td className="px-4 py-2.5 text-center">{row.full ? <span className="text-amber-canopy">✓</span> : <span className="text-text-muted">—</span>}</td>
                        <td className="px-4 py-2.5 text-center">{row.audit ? <span className="text-amber-canopy">✓</span> : <span className="text-text-muted">—</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* ── FAQ ───────────────────────────────────────────────────────────── */}
          <section className="flex flex-col gap-6">
            <h2 className="text-xs font-semibold text-amber-canopy uppercase tracking-wider">FAQ</h2>
            <div className="flex flex-col gap-3">
              {FAQ.map(({ q, a }) => (
                <div key={q} className="flex flex-col gap-1.5 p-5 rounded-xl bg-forest-900 border border-forest-700">
                  <p className="text-sm font-semibold text-text-primary">{q}</p>
                  <p className="text-sm text-text-secondary leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── CTA ───────────────────────────────────────────────────────────── */}
          <section className="flex flex-col items-center gap-4 py-6 text-center">
            <p className="text-text-secondary text-sm max-w-md leading-relaxed">
              Five minutes of planning now saves days — sometimes months — of rework later.
            </p>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <Link
                href="/quick"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-forest-800 border border-forest-600 text-text-primary hover:bg-forest-750 hover:border-forest-500 transition-all"
              >
                Quick Stack — 30 sec
              </Link>
              <Link
                href="/interview"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-amber-canopy text-forest-950 hover:bg-amber-canopy-light transition-all shadow-[0_2px_16px_rgba(217,119,6,0.3)]"
              >
                Full Consultation — 5 min
              </Link>
            </div>
          </section>

        </div>
      </div>

      <footer className="px-6 py-4 flex items-center justify-center border-t border-forest-800 mt-auto">
        <p className="text-xs text-text-muted">Canopy Tech &mdash; Build on solid ground</p>
      </footer>
    </main>
  );
}

// ── Static data ───────────────────────────────────────────────────────────────

const HOW_IT_WORKS = [
  {
    title: "Describe your project",
    body: "One sentence in Quick Stack, or answer 18 structured questions in the Full Consultation. Either way takes under 5 minutes.",
  },
  {
    title: "AI generates your architecture brief",
    body: "Your answers go to Claude with a structured prompt. You get a full stack recommendation, monthly cost estimate, compliance flags, and a corporate readiness score — tailored to your specific constraints.",
  },
  {
    title: "Paste the system prompt and start building",
    body: "The brief includes a ready-to-use vibe coding system prompt. Drop it into Cursor, Claude Code, Windsurf, or your tool of choice and build with the full context already loaded.",
  },
];

const PERSONAS = [
  {
    label: "Solo builder / indie hacker",
    body: "Side project, no team, want fast decisions. Quick Stack gives you a direction in 30 seconds. Full Consultation surfaces the traps you'd otherwise hit at 1,000 users.",
  },
  {
    label: "Early-stage founder",
    body: "Building to ship. The compliance flags and corporate readiness score mean you won't discover your GDPR exposure or SSO gap after the first enterprise prospect asks about it.",
  },
  {
    label: "Agency / freelancer",
    body: "Building for clients who need to understand what they're buying. The architecture brief is a document you can hand off — stack rationale, cost projections, and a system prompt included.",
  },
];

const DIFFERENTIATORS = [
  {
    emoji: "🛡️",
    title: "Compliance flags",
    body: "GDPR, HIPAA, and COPPA are triggered automatically from your answers — not just if you think to ask. Most tools generate files; Canopy flags the legal risks before you ship.",
  },
  {
    emoji: "💸",
    title: "Cost planning",
    body: "Monthly cost estimates with free-tier ceilings and viral-growth projections. Knowing the ceiling before you build prevents a nasty surprise at scale.",
  },
  {
    emoji: "🏢",
    title: "Corporate readiness score",
    body: "Five dimensions: SSO support, row-level security, compliance posture, observability, and API contracts. Surfaces the enterprise blockers that kill deals months later.",
  },
  {
    emoji: "🔍",
    title: "Retroactive audit",
    body: "Already shipped something? Repo Audit reviews your existing stack against the same framework. VibeKit and scaffold generators only work on greenfield — Canopy works before and after.",
  },
  {
    emoji: "🔓",
    title: "No account, no limits",
    body: "Fully free, no sign-up, no credit card, no daily cap. Every tool runs on your own session — nothing is stored server-side.",
  },
  {
    emoji: "🤖",
    title: "Tool-agnostic output",
    body: "The system prompt works in Cursor, Claude Code, Windsurf, Copilot, or any AI coding tool. Use whatever you already have.",
  },
];

const COMPARISON_ROWS = [
  { feature: "Stack recommendation", quick: true, full: true, audit: false },
  { feature: "Compliance flags (GDPR, HIPAA, COPPA)", quick: false, full: true, audit: false },
  { feature: "Monthly cost estimate", quick: false, full: true, audit: false },
  { feature: "Corporate readiness score", quick: false, full: true, audit: true },
  { feature: "Vibe coding system prompt", quick: false, full: true, audit: false },
  { feature: "Existing codebase review", quick: false, full: false, audit: true },
  { feature: "No account required", quick: true, full: true, audit: true },
];

const CONSULTATION_STEPS = [
  {
    layer: "Layer 1 — Project Basics",
    description:
      "What the app does, who it's for, what users can do, and whether AI is core to the product.",
  },
  {
    layer: "Layer 2 — Users & Scale",
    description:
      "Expected user volume, whether accounts are needed, and real-time data requirements.",
  },
  {
    layer: "Layer 3 — Data & Privacy",
    description:
      "What information the app stores, where users are located, and COPPA exposure.",
  },
  {
    layer: "Layer 4 — Constraints",
    description:
      "Monthly budget, existing vendor accounts, launch timeline, and which AI coding tool you're using.",
  },
  {
    layer: "Layer 5 — Future & Scale",
    description:
      "Enterprise potential, regulated industry exposure, monetisation plans, and IT approval requirements.",
  },
];

const SAMPLE_STACK = [
  { layer: "Frontend", recommendation: "Next.js + TypeScript", alternative: "Remix", why: "App Router handles dashboard routing cleanly" },
  { layer: "Auth", recommendation: "Clerk", alternative: "Supabase Auth", why: "Fastest setup; free tier covers 10K MAU" },
  { layer: "Database", recommendation: "Supabase (Postgres)", alternative: "PlanetScale", why: "Row-level security built in for per-user data" },
  { layer: "AI Engine", recommendation: "Claude Haiku", alternative: "GPT-4o mini", why: "Cheapest capable model for transaction categorisation" },
  { layer: "Hosting", recommendation: "Vercel", alternative: "Railway", why: "Zero-config Next.js deploys, free hobby tier" },
];

const FAQ = [
  {
    q: "How is Canopy different from VibeKit or other scaffold generators?",
    a: "Scaffold generators give you files — project structure, setup instructions, markdown for your AI agent. Canopy gives you a plan: the right stack for your constraints, compliance risks to watch, a cost model, and a readiness score. Use both: plan with Canopy, then generate your scaffold. They're not competing — they cover different moments in the build process.",
  },
  {
    q: "Do you store my answers or the generated brief?",
    a: "No. Answers are sent to the AI and immediately discarded server-side. The brief lives in your browser's session storage and is gone when you close the tab. Nothing is logged to a database.",
  },
  {
    q: "How accurate are the recommendations?",
    a: "Opinionated, not authoritative. Canopy gives you a strong starting point based on your specific constraints — scale, budget, compliance, existing accounts. Treat it as a senior engineer's first-pass recommendation, not a contract.",
  },
  {
    q: "Who is this built for?",
    a: "Vibe coders, indie hackers, and early-stage founders who are comfortable building but want to avoid classic architecture mistakes. You don't need to be technical to use it — the questions are designed in plain English.",
  },
  {
    q: "Is it free?",
    a: "Yes, entirely free. No account required.",
  },
  {
    q: "Can I share the brief with my team?",
    a: "Yes. The Full Consultation brief has a Share button that generates a URL with the brief encoded in the hash — no server involved. You can also download it as a .txt file or export to PDF.",
  },
];

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
      <path d="M9.5 19h5M10 22h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
