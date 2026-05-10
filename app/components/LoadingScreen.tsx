"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

type LoadingScreenProps = {
  onReadyForFlash: () => void;
};

export function LoadingScreen({ onReadyForFlash }: LoadingScreenProps) {
  const onFlashRef = useRef(onReadyForFlash);
  const videoRef = useRef<HTMLVideoElement>(null);
  const signaledRef = useRef(false);

  useEffect(() => {
    onFlashRef.current = onReadyForFlash;
  }, [onReadyForFlash]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  /** Release video memory when this component is unmounted (after hero is revealed). */
  useEffect(() => {
    return () => {
      const el = videoRef.current;
      if (el) {
        el.pause();
        el.removeAttribute("src");
        el.load();
      }
    };
  }, []);

  /**
   * Signal the parent once that the loading video has played through.
   * The parent will start buffering the hero video in the background.
   * This component stays visible and keeps looping until the parent unmounts it.
   */
  const signalParent = useCallback(() => {
    if (signaledRef.current) return;
    signaledRef.current = true;
    queueMicrotask(() => {
      onFlashRef.current();
    });
  }, []);

  /** When the video ends: signal parent, then loop back to the start. */
  const handleEnded = useCallback(() => {
    signalParent();
    const el = videoRef.current;
    if (el) {
      el.currentTime = 0;
      void el.play().catch(() => {});
    }
  }, [signalParent]);

  /** Some mobile browsers never fire `ended` — catch near-end via timeupdate. */
  const onTimeUpdate = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const el = e.currentTarget;
      const dur = el.duration;
      if (!Number.isFinite(dur) || dur <= 0 || dur === Infinity) return;
      if (dur - el.currentTime < 0.35) {
        signalParent();
      }
    },
    [signalParent],
  );

  /** Hard cap: signal parent after 90 s no matter what. */
  useEffect(() => {
    const id = window.setTimeout(signalParent, 90_000);
    return () => window.clearTimeout(id);
  }, [signalParent]);

  /** Start playback as soon as data is available. */
  useLayoutEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const tryPlay = () => {
      void el.play().catch(() => {
        signalParent();
      });
    };

    if (el.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) tryPlay();
    else el.addEventListener("canplay", tryPlay, { once: true });

    return () => {
      el.removeEventListener("canplay", tryPlay);
    };
  }, [signalParent]);

  return (
    <motion.div
      className="fixed z-50 flex h-full w-full max-w-[430px] flex-col"
      initial={{ opacity: 1 }}
      exit={{ opacity: 1, transition: { duration: 0 } }}
    >
      <video
        ref={videoRef}
        className="h-full w-full object-cover max-w-[430px]"
        src="/video-project-6.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        controls={false}
        onEnded={handleEnded}
        onError={signalParent}
        onTimeUpdate={onTimeUpdate}
      />
    </motion.div>
  );
}
