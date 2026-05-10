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
  /** Hero is mounted (hidden) while its video buffers. */
  const [heroMounted, setHeroMounted] = useState(false);
  /** Hero is visible after the flash transition. */
  const [showHero, setShowHero] = useState(false);
  const [flash, setFlash] = useState<FlashPhase>("idle");

  const flashStartedRef = useRef(false);
  const loadingDoneRef = useRef(false);
  const fallbackTimerRef = useRef<number | null>(null);
  const flashTimerRef = useRef<number | null>(null);

  /**
   * Trigger the white flash and then reveal the hero.
   * Guarded by flashStartedRef so it can only fire once.
   */
  const doFlash = useCallback(() => {
    if (flashStartedRef.current) return;
    flashStartedRef.current = true;

    if (fallbackTimerRef.current != null) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }

    setFlash("in");
    const ms = (timings.whiteFlashIn + timings.whiteFlashHold) * 1000;
    flashTimerRef.current = window.setTimeout(() => {
      flashTimerRef.current = null;
      setShowLoader(false);
      setShowHero(true);
      setFlash("out");
    }, ms);
  }, []);

  /**
   * Called when the loading-screen video finishes.
   * Mounts the Hero (hidden) so its video can start buffering.
   * If the hero video does not fire canPlay within 8 s, we proceed anyway.
   */
  const onLoadingVideoDone = useCallback(() => {
    if (loadingDoneRef.current) return;
    loadingDoneRef.current = true;

    setHeroMounted(true);

    fallbackTimerRef.current = window.setTimeout(doFlash, 8_000);
  }, [doFlash]);

  /**
   * Called by the Hero's video onCanPlay / onError.
   * The video is buffered — do the flash now.
   */
  const onHeroVideoReady = useCallback(() => {
    doFlash();
  }, [doFlash]);

  useEffect(() => {
    return () => {
      if (fallbackTimerRef.current != null) clearTimeout(fallbackTimerRef.current);
      if (flashTimerRef.current != null) clearTimeout(flashTimerRef.current);
    };
  }, []);

  /** Global safety net: if loading screen hangs past 18 s, skip it. */
  useEffect(() => {
    if (!showLoader) return;
    const id = window.setTimeout(onLoadingVideoDone, 18_000);
    return () => window.clearTimeout(id);
  }, [showLoader, onLoadingVideoDone]);

  return (
    <div className="relative min-h-dvh w-full overflow-x-hidden bg-black">
      {/*
        Hero renders hidden behind the loading screen while its video buffers.
        opacity is 0 until showHero flips to true.
      */}
      {heroMounted && (
        <motion.div
          className="relative z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: showHero ? 1 : 0 }}
          transition={{
            duration: timings.whiteFlashOut * 0.92,
            ease: easings.veilOut,
          }}
        >
          <Hero onVideoReady={onHeroVideoReady} />
          <Countdown />
        </motion.div>
      )}

      {/* Loading screen sits on top (z-50) until the flash hides it */}
      <AnimatePresence>
        {showLoader && (
          <LoadingScreen key="loading" onReadyForFlash={onLoadingVideoDone} />
        )}
      </AnimatePresence>

      {flash !== "idle" && (
        <motion.div
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
