import type { Transition, Variants } from "framer-motion";

/** Durations (seconds) and delays — edit this object to retune the whole intro */
export const timings = {
  /** Envelope fades + floats in */
  envelopeIn: 0.85,
  /** Pause after envelope in, before flap starts */
  afterEnvelopeIn: 0.45,
  /** Top flap opens (rotateX) */
  flapOpen: 0.95,
  /** Brief beat after flap before letter lifts */
  afterFlap: 0.12,
  /** Card / letter rises out */
  letterLift: 0.75,
  /** Pause after letter before white flash begins */
  afterLetter: 0.28,
  /** White “lightning” builds to full frame (seconds) */
  whiteFlashIn: 0.38,
  /** Hold at full white before handoff (seconds) */
  whiteFlashHold: 0.06,
  /** White fades out revealing hero (seconds) */
  whiteFlashOut: 0.72,
  /** Envelope scales up + fades (used if loader exit runs without flash) */
  envelopeExit: 0.65,
  /** Delay before calling onDone (optional polish) */
  beforeHeroHandoff: 0.05,

  /** Hero: stagger between text lines */
  heroStagger: 0.18,
  /** Hero: each line fade/slide duration */
  heroLine: 0.9,
  /** Hero: delay before first line */
  heroStartDelay: 0.25,
  /** Ken Burns loop period (one direction) */
  kenBurnsHalf: 22,
} as const;

/** Named easing curves [x1, y1, x2, y2] for Framer Motion */
export const easings = {
  silk: [0.22, 1, 0.36, 1] as const,
  softOut: [0.33, 1, 0.68, 1] as const,
  snapIn: [0.7, 0, 0.84, 0] as const,
  /** Fast brightening like a light switch / sheet lightning */
  lightning: [0.85, 0, 0.15, 1] as const,
  /** Soft dissolve after peak white */
  veilOut: [0.25, 0.9, 0.3, 1] as const,
} as const;

const silkTransition: Transition = {
  duration: timings.flapOpen,
  ease: easings.silk,
};

export const loadingVariants = {
  overlay: {
    hidden: { opacity: 1 },
    exit: {
      opacity: 0,
      transition: { duration: timings.envelopeExit * 0.5, ease: easings.softOut },
    },
  },
  /** Avoid naming a variant `initial` (confusing vs motion `initial` prop) */
  envelopeRoot: {
    boot: { opacity: 0, y: 36, scale: 0.96 },
    ready: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: timings.envelopeIn, ease: easings.softOut },
    },
    leave: {
      opacity: 0,
      scale: 1.35,
      y: -24,
      transition: { duration: timings.envelopeExit, ease: easings.silk },
    },
  },
  flap: {
    closed: { rotateX: 0 },
    open: {
      rotateX: -178,
      transition: silkTransition,
    },
  },
  letter: {
    down: { y: "12%", opacity: 0.85 },
    up: {
      y: "-115%",
      opacity: 1,
      transition: {
        duration: timings.letterLift,
        ease: easings.silk,
      },
    },
  },
} as const satisfies Record<string, Variants>;

const heroEase: Transition["ease"] = easings.softOut;

export const heroVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      delayChildren: timings.heroStartDelay,
      staggerChildren: timings.heroStagger,
    },
  },
};

export const heroLineVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
    filter: "blur(6px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: timings.heroLine,
      ease: heroEase,
    },
  },
};

export const heroNamesVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 16 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: timings.heroLine * 1.05,
      ease: easings.silk,
    },
  },
};

export const kenBurnsTransition: Transition = {
  duration: timings.kenBurnsHalf,
  ease: "linear",
  repeat: Infinity,
  repeatType: "reverse",
};
