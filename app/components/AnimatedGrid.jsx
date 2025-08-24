"use client";
import { useRef, useEffect } from "react";

// Subtle animated grid / dots background (GPU-friendly)
export default function AnimatedGrid({ className = "" }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let frame = 0;
    let raf;

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      frame += 0.5; // slow drift
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const spacing = 38;
      const t = frame * 0.01;
      ctx.save();
      ctx.globalAlpha = 0.5;
      for (let y = 0; y < window.innerHeight + spacing; y += spacing) {
        for (let x = 0; x < window.innerWidth + spacing; x += spacing) {
          const w = Math.sin((x + t * 90) * 0.01) * 0.5 + 0.5;
            // shimmer brightness
          ctx.fillStyle = `rgba(255,255,255,${w * 0.045})`;
          ctx.fillRect(x, y, 2, 2);
        }
      }
      ctx.restore();
      raf = requestAnimationFrame(render);
    };
    render();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 opacity-60 mix-blend-screen ${className}`}
    />
  );
}
