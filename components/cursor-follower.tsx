"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Cincin glow yang mengikuti kursor dan membesar di atas elemen interaktif.
 * Kursor asli tetap terlihat; hanya aktif di perangkat ber-mouse.
 */
export function CursorFollower() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 380, damping: 30, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 380, damping: 30, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);

    function onMove(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = e.target as Element | null;
      setActive(Boolean(target?.closest("a, button, [data-cursor='hover']")));
    }
    function onLeave() {
      setVisible(false);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[90]"
    >
      <motion.div
        animate={{ scale: active ? 1.9 : 1, opacity: visible ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="-ml-4 -mt-4 h-8 w-8 rounded-full border border-accent/60 bg-accent/10 shadow-[0_0_24px_rgb(var(--accent)/0.45)]"
      />
    </motion.div>
  );
}
