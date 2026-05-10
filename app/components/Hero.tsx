"use client";

import { motion } from "framer-motion";
import { easings, timings } from "@/app/lib/animations";

export function Hero() {
  return (
    <section className="relative min-h-dvh w-full overflow-hidden bg-black">
       <motion.div
       initial={{ opacity: 1 }}
       animate={{ opacity: 0 }}
       transition={{
         delay: 0,
         duration: timings.heroLine * 3,
         ease: easings.lightning,
       }}
         aria-hidden
         className="pointer-events-none absolute inset-0 z-1 "
         style={{
           backgroundImage:
             "linear-gradient(to bottom, rgb(0 0 0 / 0.3) 0%, transparent 50%), linear-gradient(to top, rgb(0 0 0  / 0.3) 0%, transparent 0%)",
         }}
     
      />
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover"
        autoPlay
        muted
        loop={false}
        playsInline
        preload="none"
        src="/hero-watermark.mp4"
      />
     <div className="absolute inset-0 z-10 bg-gray-800/40">

     </div>
     <motion.p
        dir="rtl"
        className="amiri-regular absolute top-[14%] left-1/2 z-10 w-full -translate-x-1/2 -translate-y-1/2 text-center text-xl tracking-widest font-extralight text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 0,
          duration: timings.heroLine * 3,
          ease: easings.lightning,
        }}
      >
        بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ
      </motion.p>
      <motion.p
        dir="ltr"
        className="amiri-regular  absolute top-[19%] left-1/2 z-10 w-full -translate-x-1/2 -translate-y-1/2 text-center text-[12px] tracking-widest font-thin text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 0.5,
          duration: timings.heroLine * 3,
          ease: easings.lightning,
        }}
      >
        WE&apos;RE GETTING MARRIED
      </motion.p>
      <motion.p
        dir="ltr"
        className="font-[family-name:var(--font-mea-culpa)] shadow-3xl font-medium absolute text-center text-[30px] top-[36%] left-[30%] z-10 w-full -translate-x-1/2 -translate-y-1/2 tracking-widest text-white-80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 1.25,
          duration: timings.heroLine * 3,
          ease: easings.lightning,
        }}
      >
        Mohammed
      </motion.p>
      <motion.p
        dir="ltr"
        className="font-[family-name:var(--font-mea-culpa)] font-medium absolute text-center text-[40px] top-[40%] left-[55%] z-10 w-full -translate-x-1/2 -translate-y-1/2 tracking-widest text-white-80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 2.25,
          duration: timings.heroLine * 3,
          ease: easings.lightning,
        }}
      >
        &
      </motion.p>
      <motion.p
        dir="ltr"
        className="font-[family-name:var(--font-mea-culpa)] shadow-3xl font-medium  absolute text-center text-[30px] tracking-widest top-[42%] left-[75%] z-10 w-full -translate-x-1/2 -translate-y-1/2 text-white-80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 3,
          duration: timings.heroLine * 3,
          ease: easings.lightning,
        }}
      >
        Noor
      </motion.p>
      <motion.p
        dir="ltr"
        className="amiri-regular font-extralight absolute top-[50%] left-1/2 z-10 w-full -translate-x-1/2 -translate-y-1/2 text-center text-[25px] tracking-widest text-white "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 3.75,
          duration: timings.heroLine * 3,
          ease: easings.lightning,
        }}
      >
        17 July 2026
      </motion.p>
      {/* <motion.p
        dir="ltr"
        className="amiri-regular font-extralight shadow-lg  absolute text-center text-[16px] tracking-widest top-[57%] left-1/2 z-10 w-full -translate-x-1/2 -translate-y-1/2 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 4.5,
          duration: timings.heroLine * 3,
          ease: easings.lightning,
        }}
      >
        فى الدنيا والآخرة
      </motion.p> */}
      

    </section>
  );
}
