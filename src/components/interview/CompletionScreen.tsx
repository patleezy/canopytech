"use client";

interface CompletionScreenProps {
  onReset: () => void;
}

export function CompletionScreen({ onReset }: CompletionScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-12 text-center">
      {/* Animated icon */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-forest-600" />
        <div className="absolute inset-0 rounded-full border-t-2 border-amber-canopy animate-spin" />
        <div className="absolute inset-2 rounded-full bg-forest-800 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-amber-canopy" aria-hidden="true">
            <path
              d="M12 3v1m0 16v1M3 12H2m20 0h-1M5.6 5.6l-.7-.7m14.1 14.1-.7-.7M5.6 18.4l-.7.7M18.4 5.6l.7-.7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-text-primary">
          Generating your Project Brief
        </h2>
        <p className="text-text-secondary max-w-sm">
          Canopy Tech is analyzing your answers and building your architecture recommendation. This usually takes 15–30 seconds.
        </p>
      </div>

      {/* Pulse dots */}
      <div className="flex items-center gap-2" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-amber-canopy animate-pulse"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>

      <button
        onClick={onReset}
        className="text-xs text-text-muted hover:text-text-secondary transition-colors underline underline-offset-4 mt-4"
      >
        Start over
      </button>
    </div>
  );
}
