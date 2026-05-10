"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Hero } from "@/app/components/Hero";
import { LoadingScreen } from "@/app/components/LoadingScreen";
import { easings, timings } from "@/app/lib/animations";
import Countdown from "./components/Countdown";

type FlashPhase = "idle" | "in" | "out";

export default function Home() {
  const [showLoader, setShowLoader] = useState(true);
  const [flash, setFlash] = useState<FlashPhase>("idle");
  const [showHero, setShowHero] = useState(false);
  const handoffTimerRef = useRef<number | null>(null);
  const heroDelayRef = useRef<number | null>(null);

  const scheduleHeroHandoff = useCallback(() => {
    if (handoffTimerRef.current != null) return;

    setFlash("in");
    const ms = (timings.whiteFlashIn + timings.whiteFlashHold) * 1000;
    handoffTimerRef.current = window.setTimeout(() => {
      handoffTimerRef.current = null;
      setShowLoader(false);
      setFlash("out");
      /**
       * Small delay before mounting the Hero so the browser can release the
       * loading-screen video memory before the hero video starts loading.
       * Without this gap, mobile browsers crash and reload the page, looping
       * the loading screen.
       */
      heroDelayRef.current = window.setTimeout(() => {
        heroDelayRef.current = null;
        setShowHero(true);
      }, 300);
    }, ms);
  }, []);

  useEffect(() => {
    return () => {
      if (handoffTimerRef.current != null) {
        clearTimeout(handoffTimerRef.current);
        handoffTimerRef.current = null;
      }
      if (heroDelayRef.current != null) {
        clearTimeout(heroDelayRef.current);
        heroDelayRef.current = null;
      }
    };
  }, []);

  /** If the intro video stalls (missing file, mobile codec, no `ended`), never stay on loader forever */
  useEffect(() => {
    if (!showLoader) return;
    const id = window.setTimeout(() => {
      scheduleHeroHandoff();
    }, 18_000);
    return () => window.clearTimeout(id);
  }, [showLoader, scheduleHeroHandoff]);

  return (
    <div className="relative min-h-dvh w-full overflow-x-hidden bg-white">
      <AnimatePresence>
        {showLoader && (
          <LoadingScreen key="loading" onReadyForFlash={scheduleHeroHandoff} />
        )}
      </AnimatePresence>

      {showHero && (
        <motion.div
          key="main"
          className="relative z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: showHero ? 1 : 0 }}
          transition={{
            duration: timings.whiteFlashOut * 0.92,
            ease: easings.veilOut,
          }}
        >
          <Hero />
          <Countdown />
        </motion.div>
      )}

      {flash !== "idle" && (
        <motion.div
          key="white-flash"
          aria-hidden
          className="pointer-events-none fixed inset-y-0 left-1/2 z-[100] h-dvh w-full max-w-[430px] -translate-x-1/2 bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: flash === "out" ? 0 : 1 }}
          transition={
            flash === "out"
              ? { duration: timings.whiteFlashOut, ease: easings.veilOut }
              : { duration: timings.whiteFlashIn, ease: easings.lightning }
          }
          onAnimationComplete={() => {
            setFlash((f) => (f === "out" ? "idle" : f));
          }}
        />
      )}
    </div>
  );
}
