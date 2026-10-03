"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/** Kartu dengan tilt 3D + spotlight yang mengikuti kursor. */
export function TiltCard({
  children,
  className,
  max = 7,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 180, damping: 18, mass: 0.5 };
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    if (reduce) return;
    px.set(x / r.width);
    py.set(y / r.height);
  }

  function reset() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <div style={{ perspective: 1000 }} className="h-full">
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={reset}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={cn(
          "group relative h-full overflow-hidden rounded-2xl border border-line bg-card shadow-soft transition-colors duration-300 hover:border-accent/50",
          className,
        )}
      >
        <div className="spotlight pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {children}
      </motion.div>
    </div>
  );
}
