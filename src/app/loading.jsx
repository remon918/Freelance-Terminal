"use client";

const STEPS = [
  { label: "Initializing workspace", emoji: "⚡" },
  { label: "Loading your profile", emoji: "👤" },
  { label: "Fetching tasks & proposals", emoji: "📋" },
  { label: "Almost there", emoji: "✨" },
];

export default function Loading() {
  return (
    <>
      <style jsx global>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spinReverse {
          to {
            transform: rotate(-360deg);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes pulseDot {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(0.7);
            opacity: 0.4;
          }
        }

        @keyframes progress {
          0% {
            width: 10%;
          }
          100% {
            width: 95%;
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="fixed inset-0 z-9999 flex items-center justify-center bg-base-100">
        <div className="relative w-full max-w-sm mx-4 rounded-3xl border border-cyan-500/10 bg-base-200/50 backdrop-blur-xl p-8 shadow-2xl animate-[fadeUp_.5s_ease]">
          {/* Logo */}
          <div className="animate-[float_3s_ease-in-out_infinite]">
            <div className="relative mx-auto mb-6 h-20 w-20">
              <svg
                viewBox="0 0 80 80"
                className="absolute inset-0 h-full w-full animate-[spin_1.4s_linear_infinite]"
              >
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  fill="none"
                  stroke="rgba(34,211,238,.15)"
                  strokeWidth="3"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="55 171"
                />
              </svg>

              <svg
                viewBox="0 0 60 60"
                className="absolute inset-2.5 h-15 w-15 animate-[spinReverse_2s_linear_infinite]"
              >
                <circle
                  cx="30"
                  cy="30"
                  r="26"
                  fill="none"
                  stroke="rgba(34,211,238,.1)"
                  strokeWidth="2"
                />
                <circle
                  cx="30"
                  cy="30"
                  r="26"
                  fill="none"
                  stroke="rgba(34,211,238,.4)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="20 143"
                />
              </svg>

              <div className="absolute inset-3.5 flex items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10">
                <span className="text-2xl font-bold text-cyan-400">F</span>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center">
            <h2 className="text-xl font-bold">
              Freelance<span className="text-cyan-400">Terminal</span>
            </h2>

            <p className="mt-2 text-xs tracking-widest text-base-content/50 uppercase">
              Setting up your workspace...
            </p>
          </div>

          {/* Steps */}
          <div className="mt-6 space-y-2">
            {STEPS.map((step) => (
              <div
                key={step.label}
                className="flex items-center gap-3 rounded-xl border border-base-300 bg-base-100/50 px-3 py-2"
              >
                <div className="h-2 w-2 rounded-full bg-cyan-400 animate-[pulseDot_.9s_ease-in-out_infinite]" />
                <span>{step.emoji}</span>
                <span className="text-sm text-base-content/70">
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          {/* Progress */}
          <div className="mt-6">
            <div className="mb-2 flex justify-between text-xs">
              <span className="text-base-content/50">Loading</span>
              <span className="font-semibold text-cyan-400">Please wait</span>
            </div>

            <div className="h-1 overflow-hidden rounded-full bg-base-300">
              <div
                className="h-full rounded-full bg-cyan-400 animate-[progress_3s_linear_infinite]"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}