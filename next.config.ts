import type { NextConfig } from "next";

const CSP = [
  "default-src 'self'",
  // Next.js requires unsafe-inline for styles; inline scripts for hydration
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  // Geist font via next/font serves from same origin
  "font-src 'self' data:",
  // Only talk to Anthropic from the server — this blocks any accidental client-side calls
  "connect-src 'self'",
  "img-src 'self' data: blob:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  // Prevent clickjacking
  { key: "X-Frame-Options", value: "DENY" },
  // Stop MIME sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Referrer leakage
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // HSTS (only active over HTTPS — Vercel handles this)
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Disable unnecessary browser features
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Content Security Policy
  { key: "Content-Security-Policy", value: CSP },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
