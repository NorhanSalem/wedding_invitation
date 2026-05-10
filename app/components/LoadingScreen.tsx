"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

type LoadingScreenProps = {
  /** Fired after flap + letter; parent shows white flash then unmounts this screen. */
  onReadyForFlash: () => void;
};

/**
 * Full-screen intro video that signals parent when playback completes.
 * Mobile Safari often blocks autoplay or fails to fire `ended`; fallbacks avoid a stuck loader.
 */
export function LoadingScreen({ onReadyForFlash }: LoadingScreenProps) {
  const onFlashRef = useRef(onReadyForFlash);
  const videoRef = useRef<HTMLVideoElement>(null);
  const doneRef = useRef(false);
  const durationFallbackRef = useRef<number | null>(null);

  useEffect(() => {
    onFlashRef.current = onReadyForFlash;
  }, [onReadyForFlash]);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    if (durationFallbackRef.current != null) {
      clearTimeout(durationFallbackRef.current);
      durationFallbackRef.current = null;
    }
    /** Free video memory immediately so the hero video does not cause a memory spike on mobile. */
    const el = videoRef.current;
    if (el) {
      el.pause();
      el.removeAttribute("src");
      el.load();
    }
    /** Defer so `ended` / `timeupdate` and React paint don't race (notably iOS Safari). */
    queueMicrotask(() => {
      onFlashRef.current();
    });
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const id = window.setTimeout(finish, 90_000);
    return () => window.clearTimeout(id);
  }, [finish]);

  useLayoutEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const tryPlay = () => {
      void el.play().catch(() => {
        window.setTimeout(finish, 600);
      });
    };

    if (el.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) tryPlay();
    else el.addEventListener("canplay", tryPlay, { once: true });

    return () => {
      el.removeEventListener("canplay", tryPlay);
    };
  }, [finish]);

  useEffect(
    () => () => {
      if (durationFallbackRef.current != null) {
        clearTimeout(durationFallbackRef.current);
      }
    },
    [],
  );

  const onLoadedMetadata = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const d = e.currentTarget.duration;
      /** Streaming / some mobile browsers report `Infinity` until fully buffered — still schedule a cap */
      const delayMs =
        Number.isFinite(d) && d > 0 && d !== Infinity
          ? Math.min((d + 6) * 1000, 85_000)
          : 30_000;
      if (durationFallbackRef.current != null) {
        clearTimeout(durationFallbackRef.current);
      }
      durationFallbackRef.current = window.setTimeout(() => {
        durationFallbackRef.current = null;
        finish();
      }, delayMs);
    },
    [finish],
  );

  /** Some mobile browsers play to the last frame but never fire `ended`. */
  const onTimeUpdate = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const el = e.currentTarget;
      const dur = el.duration;
      if (!Number.isFinite(dur) || dur <= 0 || dur === Infinity) return;
      if (dur - el.currentTime < 0.35) {
        finish();
      }
    },
    [finish],
  );

  return (
    <motion.div
      className="fixed z-50 flex h-full w-full max-w-[430px]  flex-col"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 1,
        transition: { duration: 0 },
      }}
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
        onEnded={finish}
        onError={finish}
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={onTimeUpdate}
      />
    </motion.div>
  );
}
