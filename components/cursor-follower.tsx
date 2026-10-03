"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Titik tinta yang mengikuti kursor dan membesar di atas elemen interaktif.
 * Memakai blend "difference" sehingga selalu kontras di tema terang maupun gelap,
 * tanpa glow berwarna. Kursor asli tetap terlihat; hanya aktif di perangkat ber-mouse.
 */
export function CursorFollower() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 420, damping: 34, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 420, damping: 34, mass: 0.5 });

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
      className="pointer-events-none fixed left-0 top-0 z-[90] mix-blend-difference"
    >
      <motion.div
        animate={{ scale: active ? 4.2 : 1, opacity: visible ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
        className="-ml-1.5 -mt-1.5 h-3 w-3 rounded-full bg-white"
      />
    </motion.div>
  );
}
