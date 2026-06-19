"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700", "900"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
});

const messages = [
  "You have lost.",
  "Searching for a safe route...",
  "Redirecting to the previous page...",
];

const CONTOUR_LINES = [
  { y: 60, a: 22 },
  { y: 170, a: 28 },
  { y: 280, a: 20 },
  { y: 390, a: 30 },
  { y: 500, a: 24 },
  { y: 610, a: 26 },
  { y: 720, a: 18 },
];

const COMPASS_TICKS = [0, 45, 90, 135, 180, 225, 270, 315];

export default function NotFound() {
  const router = useRouter();

  const [text, setText] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
  const currentMessage = messages[messageIndex];

  if (!currentMessage) return;

  let charIndex = 0;

  const interval = setInterval(() => {
    setText(currentMessage.slice(0, charIndex + 1));
    charIndex++;

    if (charIndex >= currentMessage.length) {
      clearInterval(interval);

      setTimeout(() => {
        if (messageIndex < messages.length - 1) {
          setMessageIndex((prev) => prev + 1);
          setText("");
        }
      }, 700);
    }
  }, 35);

  return () => clearInterval(interval);
}, [messageIndex]);

useEffect(() => {
  const interval = setInterval(() => {
    setSeconds((prev) => {
      if (prev <= 1) {
        clearInterval(interval);
        return 0;
      }

      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, []);

useEffect(() => {
  const timer = setTimeout(() => {
    router.back();
  }, 5000);

  return () => clearTimeout(timer);
}, [router]);

  return (
    <main
      className={`${inter.className} relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16 text-white`}
      style={{
        background: `
          radial-gradient(circle at top, rgba(34,211,238,.08), transparent 35%),
          linear-gradient(180deg, #071c37 0%, #041122 100%)
        `,
      }}
    >
      {/* Frame */}
      <div className="absolute inset-4 rounded border border-cyan-400/20" />
      <div className="absolute inset-7 rounded border border-cyan-400/10" />

      {/* Coordinates */}
      <div
        className={`${plexMono.className} absolute inset-0 text-[10px] uppercase tracking-[0.25em] text-cyan-400/50`}
      >
        <span className="absolute left-8 top-8">N · 23.81°</span>
        <span className="absolute right-8 top-8">E · 90.41°</span>
        <span className="absolute bottom-8 left-8">W</span>
        <span className="absolute bottom-8 right-8">S</span>
      </div>

      {/* Topographic lines */}
      <svg
        className="absolute inset-0 h-full w-full opacity-10"
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
      >
        {CONTOUR_LINES.map(({ y, a }) => (
          <path
            key={y}
            d={`M-50,${y} C100,${y - a} 250,${y + a} 400,${y} S700,${y + a} 850,${y} S1150,${y + a} 1300,${y}`}
            stroke="#22d3ee"
            strokeWidth="1.3"
            fill="none"
          />
        ))}
      </svg>

      {/* Trail */}
      <svg
        className="nf-trail absolute bottom-[10%] right-[2%] hidden h-45 w-95 sm:block"
        viewBox="0 0 380 180"
      >
        <path
          className="nf-trail-path"
          d="M10,16 C110,34 170,80 240,98 C300,113 330,126 348,136"
          fill="none"
          stroke="#22d3ee"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="2 10"
        />

        <polyline
          points="346,134 356,142 348,148 360,154"
          fill="none"
          stroke="#06b6d4"
          strokeWidth="2"
        />
        <text
          x="250"
          y="166"
          fontSize="10"
          fill="#22d3ee"
          letterSpacing="2"
          className={plexMono.className}
          transform="rotate(8 250 166)"
        >
          TRAIL ENDS HERE
        </text>
      </svg>

      <div className="relative z-10 flex max-w-xl flex-col items-center text-center">
        {/* Compass */}
        <svg className="mb-8 h-32 w-32" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r="62"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="1"
            opacity=".5"
          />

          <circle
            cx="80"
            cy="80"
            r="50"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="1"
            opacity=".25"
          />

          {COMPASS_TICKS.map((angle) => (
            <line
              key={angle}
              x1="80"
              y1="14"
              x2="80"
              y2={angle % 90 === 0 ? "28" : "22"}
              stroke="#22d3ee"
              strokeWidth={angle % 90 === 0 ? "2" : "1"}
              transform={`rotate(${angle} 80 80)`}
            />
          ))}

          <g className="nf-needle" style={{ transformOrigin: "80px 80px" }}>
            <line
              x1="80"
              y1="80"
              x2="80"
              y2="28"
              stroke="#22d3ee"
              strokeWidth="3"
              transform="rotate(18 80 80)"
            />

            <circle cx="80" cy="80" r="4" fill="#22d3ee" />
          </g>
        </svg>

        <p
          className={`${plexMono.className} mb-3 text-xs uppercase tracking-[0.4em] text-cyan-400`}
        >
          Error · 404
        </p>

        <h1
          className={`${fraunces.className} text-[7rem] font-bold italic leading-none md:text-[9rem]`}
        >
          404
        </h1>

        <h2 className={`${fraunces.className} mt-4 text-3xl font-semibold`}>
          You have sailed off the edge of the map.
        </h2>

        <div className="mt-8 h-16 flex items-center justify-center">
          <p
            className={`${plexMono.className} text-cyan-400 text-sm md:text-base`}
          >
            {text}
            <span className="animate-pulse">|</span>
          </p>
        </div>

        <p className={`${plexMono.className} mt-3 text-xs text-cyan-400/50`}>
          Redirecting in {seconds}s...
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/"
            className="rounded-lg bg-cyan-400 px-7 py-3 font-semibold text-[#071c37] transition hover:bg-cyan-300"
          >
            Return Home
          </Link>

          <button
            onClick={() => router.back()}
            className={`${plexMono.className} text-cyan-300 hover:text-white`}
          >
            Go Back
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes wobble {
          0% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(4deg);
          }
          50% {
            transform: rotate(0deg);
          }
          75% {
            transform: rotate(-4deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }

        @keyframes march {
          to {
            stroke-dashoffset: -120;
          }
        }

        .nf-needle {
          animation: wobble 5s ease-in-out infinite;
        }

        .nf-trail-path {
          animation: march 8s linear infinite;
        }
      `}</style>
    </main>
  );
}
