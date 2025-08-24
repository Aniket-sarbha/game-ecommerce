"use client";
import { useEffect, useRef } from "react";

const logos = [
  "Genshin Impact",
  "Call of Duty",
  "PUBG Mobile",
  "Free Fire",
  "Valorant",
  "Mobile Legends",
  "FIFA Mobile",
  "Clash Royale"
];

export default function MarqueeLogos() {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    let frame;
    const el = ref.current;
    const animate = () => {
      el.scrollLeft += 0.5; // smooth slow scroll
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth) {
        el.scrollLeft = 0;
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="relative py-10">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />
      <div className="relative overflow-hidden">
        <div
          ref={ref}
          className="flex gap-8 overflow-hidden whitespace-nowrap [scrollbar-width:none] no-visible-scrollbar px-6"
        >
          {[...logos, ...logos].map((l, i) => (
            <div
              key={i}
              className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-sm text-white/60 hover:text-white hover:bg-white/10 tracking-wide transition-colors"
            >
              {l}
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#030303] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#030303] to-transparent" />
      </div>
    </div>
  );
}
