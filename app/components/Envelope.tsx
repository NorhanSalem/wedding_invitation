"use client";

import { motion, type Variants } from "framer-motion";
import { loadingVariants } from "@/app/lib/animations";

type FlapState = "closed" | "open";
type LetterState = "down" | "up";

type EnvelopeProps = {
  flapState: FlapState;
  letterState: LetterState;
  className?: string;
};

/** Gold sprig seal — SVG so it stays sharp at any size */
function GoldSeal({ className }: {  className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--gold-bright)" />
          <stop offset="45%" stopColor="var(--gold)" />
          <stop offset="100%" stopColor="#8a6b38" />
        </linearGradient>
      </defs>
      <path
        d="M24 4C18 12 8 18 6 28c2 8 10 14 18 22 8-8 16-14 18-22-2-10-12-16-18-24z"
        fill="url(#goldGrad)"
        opacity={0.95}
      />
      <path
        d="M24 14c-3 4-8 7-9 12 1 5 5 9 9 14 4-5 8-9 9-14-1-5-6-8-9-12z"
        fill="#6b5228"
        opacity={0.35}
      />
    </svg>
  );
}

const flapMotionVariants: Variants = {
  closed: loadingVariants.flap.closed,
  open: loadingVariants.flap.open,
};

const letterMotionVariants: Variants = {
  down: loadingVariants.letter.down,
  up: loadingVariants.letter.up,
};

/**
 * Full-viewport 3D envelope: body + triangular top flap + inner card.
 */
export function Envelope({ flapState, letterState, className = "" }: EnvelopeProps) {
  return (
    <div
      className={`relative h-full min-h-0 w-full perspective-[2000px] perspective-origin-[50%_38%] ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 z-30 opacity-[0.12] mix-blend-overlay sm:opacity-[0.14]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="absolute inset-0">
        <motion.div
          className="absolute left-[8%] right-[8%] top-[16%] z-[1] h-[64%] rounded-sm border border-white/10 bg-[linear-gradient(145deg,#f8f4ec_0%,#ebe4d6_45%,#dfd6c4_100%)] shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
          style={{ transformStyle: "preserve-3d" }}
          variants={letterMotionVariants}
          initial="down"
          animate={letterState}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.55),transparent_55%)]" />
        </motion.div>

        <div
          className="absolute inset-0 z-[2] shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
          style={{
            background: `
              linear-gradient(165deg, rgba(255,255,255,0.06) 0%, transparent 42%),
              linear-gradient(to bottom, var(--green-soft) 0%, var(--green-deep) 48%, var(--green-shadow) 100%)
            `,
            clipPath: "polygon(0% 22%, 50% 58%, 100% 22%, 100% 100%, 0% 100%)",
          }}
        />

        <div
          className="absolute inset-x-0 top-[22%] z-[3] h-[40%]"
          style={{
            background: `linear-gradient(120deg, transparent 0%, var(--green-shadow) 22%, transparent 43%, transparent 57%, var(--green-shadow) 78%, transparent 100%)`,
            opacity: 0.45,
            clipPath: "polygon(0% 0%, 50% 100%, 100% 0%)",
          }}
        />

        <motion.div
          className="absolute inset-x-0 top-0 z-[5] h-[48%] origin-top"
          style={{ transformStyle: "preserve-3d" }}
          variants={flapMotionVariants}
          initial="closed"
          animate={flapState}
        >
          <div
            className="relative h-full w-full"
            style={{
              background: `
                linear-gradient(185deg, rgba(255,255,255,0.12) 0%, transparent 55%),
                linear-gradient(to bottom, var(--green-soft) 0%, var(--green-deep) 100%)
              `,
              clipPath: "polygon(0% 0%, 100% 0%, 50% 100%)",
              boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.12)",
            }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-25"
              style={{
                background:
                  "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)",
              }}
            />
            <div className="absolute bottom-[6%] left-1/2 flex w-[min(18vw,7.5rem)] -translate-x-1/2 justify-center drop-shadow-[0_6px_16px_rgba(0,0,0,0.4)]">
              <GoldSeal className="h-[min(20vw,8.5rem)] w-[min(16vw,6.5rem)]" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
