"use client";

import React, { useEffect, useState } from "react";

/** 17 July 2026, 19:00 — interpreted in the viewer’s local timezone */
const WEDDING_AT = new Date(2026, 6, 17, 19, 0, 0);

function getRemaining() {
  const diff = WEDDING_AT.getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true as const };
  }
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds, ended: false as const };
}

const Countdown = () => {
  const [remaining, setRemaining] = useState(getRemaining);

  useEffect(() => {
    const id = window.setInterval(() => setRemaining(getRemaining()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const { days, hours, minutes, seconds, ended } = remaining;

  return (
    <>
      <div className="flex overflow-hidden h-full w-full flex-col items-center justify-center gap-2 bg-[#5a5f43] px-10 pt-12 pb-5">
        <span className="ballet-regular h-full w-full pb-4 text-center text-4xl font-medium tracking-tighter text-white">
          MN
        </span>
        <span className="ballet-regular text-[20px] font-bold text-white">
          Countdown
        </span>
        <span className="amiri-regular text-center text-[14px] font-light text-white/60">
          TO THE MOST SPICIAL DAY OF OUR LIVES
        </span>
      </div>
      <div className="flex w-full justify-center bg-[#5a5f43] px-4 pb-10">
        {ended ? (
          <p className="amiri-regular text-center text-sm text-white/90">
            It&apos;s time — see you there!
          </p>
        ) : (
          <div className="grid w-full max-w-sm grid-cols-4 gap-2 text-center text-white-80">
            <div className="amiri-regular flex flex-col  rounded-md px-2 ">
              <span className="bodoni-moda-extralight tabular-nums text-[42px] tracking-widest">
                {days}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-white/60">
                Days
              </span>
            </div>
            <div className="amiri-regular flex flex-col  px-2 ">
              <span className="bodoni-moda-extralight tabular-nums text-[42px] tracking-widest">
                {String(hours).padStart(2, "0")}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-white/60">
                Hours
              </span>
            </div>
            <div className="amiri-regular flex flex-col  rounded-md px-2 ">
              <span className="bodoni-moda-extralight tabular-nums text-[42px] tracking-widest">
                {String(minutes).padStart(2, "0")}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-white/60">
                Min
              </span>
            </div>
            <div className="amiri-regular flex flex-col  rounded-md px-2 ">
              <span className="bodoni-moda-extralight tabular-nums text-[42px] tracking-widest">
                {String(seconds).padStart(2, "0")}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-white/60">
                Sec
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Countdown;
