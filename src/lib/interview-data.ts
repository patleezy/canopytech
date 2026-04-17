import type { Question } from "@/types/interview";

export const QUESTIONS: Question[] = [
  // ── LAYER 1: PROJECT BASICS ──────────────────────────────────────────────────
  {
    id: 1,
    layer: 1,
    layerName: "Project Basics",
    type: "free-text",
    text: "What does your app do? Describe it in 2–3 sentences like you're explaining it to a friend.",
  },
  {
    id: 2,
    layer: 1,
    layerName: "Project Basics",
    type: "single-select",
    text: "Who is it for?",
    options: [
      { id: "just_me", label: "Just me" },
      { id: "small_team", label: "A small team I know" },
      { id: "anyone", label: "Anyone on the internet" },
      { id: "company", label: "A specific company or client" },
    ],
  },
  {
    id: 3,
    layer: 1,
    layerName: "Project Basics",
    type: "multi-select",
    text: "What should users be able to do in it?",
    options: [
      { id: "read", label: "Read or view information" },
      { id: "submit", label: "Submit or enter information" },
      { id: "create", label: "Create and manage their own content" },
      { id: "communicate", label: "Communicate with others" },
    ],
  },
  {
    id: 4,
    layer: 1,
    layerName: "Project Basics",
    type: "single-select",
    text: "Does it need AI?",
    options: [
      { id: "ai_core", label: "Yes — AI is the core feature" },
      { id: "ai_assist", label: "Yes — AI assists but isn't the main feature" },
      { id: "not_sure", label: "Not sure" },
      { id: "no_ai", label: "No" },
    ],
  },

  // ── LAYER 2: USERS & SCALE ───────────────────────────────────────────────────
  {
    id: 5,
    layer: 2,
    layerName: "Users & Scale",
    type: "single-select",
    text: "How many people do you expect to use this?",
    options: [
      { id: "just_me", label: "Just me" },
      { id: "small_group", label: "Small group 2–20" },
      { id: "hundreds", label: "Hundreds" },
      { id: "thousands", label: "Thousands or more" },
      { id: "no_idea", label: "No idea yet" },
    ],
  },
  {
    id: 6,
    layer: 2,
    layerName: "Users & Scale",
    type: "single-select",
    text: "Do users need their own accounts?",
    options: [
      { id: "yes_private", label: "Yes — private data per user" },
      { id: "yes_optional", label: "Yes — but optional sign-in" },
      { id: "no_accounts", label: "No — same experience for everyone" },
      { id: "not_sure", label: "Not sure" },
    ],
  },
  {
    id: 7,
    layer: 2,
    layerName: "Users & Scale",
    type: "single-select",
    text: "Does it need to update in real time?",
    options: [
      { id: "yes", label: "Yes definitely" },
      { id: "maybe", label: "Maybe eventually" },
      { id: "no", label: "No" },
    ],
  },

  // ── LAYER 3: DATA & PRIVACY ──────────────────────────────────────────────────
  {
    id: 8,
    layer: 3,
    layerName: "Data & Privacy",
    type: "multi-select",
    text: "What kind of information will your app store?",
    options: [
      { id: "nothing", label: "Nothing — it's stateless" },
      { id: "preferences", label: "Basic preferences or settings" },
      { id: "ugc", label: "User-generated content (posts, notes, files)" },
      { id: "personal", label: "Personal information (names, emails, addresses)" },
      { id: "sensitive", label: "Sensitive information (health, financial, legal data)" },
    ],
  },
  {
    id: 9,
    layer: 3,
    layerName: "Data & Privacy",
    type: "single-select",
    text: "Where are your users located?",
    options: [
      { id: "us_only", label: "Just the US" },
      { id: "us_europe", label: "US and Europe" },
      { id: "global", label: "Global" },
      { id: "not_sure", label: "Not sure yet" },
    ],
  },
  {
    id: 10,
    layer: 3,
    layerName: "Data & Privacy",
    type: "single-select",
    text: "Could this app ever handle information about children under 13?",
    options: [
      { id: "yes", label: "Yes" },
      { id: "no", label: "No" },
      { id: "not_sure", label: "Not sure" },
    ],
  },

  // ── LAYER 4: CONSTRAINTS ─────────────────────────────────────────────────────
  {
    id: 11,
    layer: 4,
    layerName: "Constraints",
    type: "single-select",
    text: "What's your monthly budget for services and APIs?",
    options: [
      { id: "free", label: "$0 — free tiers only" },
      { id: "under_25", label: "Under $25/month" },
      { id: "25_to_100", label: "$25–100/month" },
      { id: "100_plus", label: "$100+/month" },
      { id: "not_sure", label: "Not sure yet" },
    ],
  },
  {
    id: 12,
    layer: 4,
    layerName: "Constraints",
    type: "multi-select",
    text: "Do you have any existing accounts with these services?",
    options: [
      { id: "google_cloud", label: "Google Cloud" },
      { id: "firebase", label: "Firebase" },
      { id: "aws", label: "AWS" },
      { id: "github", label: "GitHub" },
      { id: "vercel", label: "Vercel" },
      { id: "netlify", label: "Netlify" },
      { id: "supabase", label: "Supabase" },
      { id: "openai", label: "OpenAI" },
      { id: "none", label: "None yet" },
    ],
  },
  {
    id: 13,
    layer: 4,
    layerName: "Constraints",
    type: "single-select",
    text: "When do you want to launch?",
    options: [
      { id: "this_week", label: "This week" },
      { id: "this_month", label: "This month" },
      { id: "no_rush", label: "No rush — doing it right matters more" },
      { id: "already_live", label: "Already launched — I need an audit" },
    ],
  },
  {
    id: 14,
    layer: 4,
    layerName: "Constraints",
    type: "single-select",
    text: "What vibe coding tool are you using?",
    options: [
      { id: "cursor", label: "Cursor" },
      { id: "claude", label: "Claude" },
      { id: "windsurf", label: "Windsurf" },
      { id: "lovable", label: "Lovable" },
      { id: "bolt", label: "Bolt" },
      { id: "other", label: "Other" },
      { id: "not_sure", label: "Not sure yet" },
    ],
  },

  // ── LAYER 5: FUTURE & SCALE ──────────────────────────────────────────────────
  {
    id: 15,
    layer: 5,
    layerName: "Future & Scale",
    type: "single-select",
    text: "Could you see your company or employer using this someday?",
    options: [
      { id: "yes_goal", label: "Yes — that's the goal" },
      { id: "maybe", label: "Maybe eventually" },
      { id: "no_personal", label: "No — this is personal or indie" },
      { id: "self_employed", label: "I work for myself" },
    ],
  },
  {
    id: 16,
    layer: 5,
    layerName: "Future & Scale",
    type: "single-select",
    text: "Do you work in a regulated industry?",
    options: [
      { id: "healthcare", label: "Healthcare" },
      { id: "finance_legal", label: "Finance or Legal" },
      { id: "education_k12", label: "Education K-12" },
      { id: "government", label: "Government" },
      { id: "none", label: "None of the above" },
    ],
  },
  {
    id: 17,
    layer: 5,
    layerName: "Future & Scale",
    type: "single-select",
    text: "Would you ever want to charge money for this?",
    options: [
      { id: "yes_plan", label: "Yes — that's the plan" },
      { id: "maybe_premium", label: "Maybe a premium tier eventually" },
      { id: "always_free", label: "No — always free" },
      { id: "not_sure", label: "Not sure" },
    ],
  },
  {
    id: 18,
    layer: 5,
    layerName: "Future & Scale",
    type: "single-select",
    text: "Would a security or IT team ever need to approve this?",
    options: [
      { id: "yes", label: "Yes definitely" },
      { id: "possibly", label: "Possibly" },
      { id: "no", label: "No" },
    ],
  },
];

export const LAYERS: Record<
  number,
  { name: string; questionIds: number[] }
> = {
  1: { name: "Project Basics", questionIds: [1, 2, 3, 4] },
  2: { name: "Users & Scale", questionIds: [5, 6, 7] },
  3: { name: "Data & Privacy", questionIds: [8, 9, 10] },
  4: { name: "Constraints", questionIds: [11, 12, 13, 14] },
  5: { name: "Future & Scale", questionIds: [15, 16, 17, 18] },
};

export const TOTAL_QUESTIONS = QUESTIONS.length;
