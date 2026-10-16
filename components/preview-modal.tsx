"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/lib/types";
import { cn, ensureUrl, hostOf } from "@/lib/utils";

type Mode = "live" | "image";
type Device = "desktop" | "mobile";

const FOCUSABLE = 'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

/** Preview projek (situs live di dalam frame, atau screenshot) sebelum membuka link aslinya. */
export function PreviewModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const liveUrl = ensureUrl(project.live_url);
  const [mode, setMode] = useState<Mode>(liveUrl ? "live" : "image");
  const [device, setDevice] = useState<Device>("desktop");
  const [loaded, setLoaded] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Fokus masuk ke dialog saat terbuka, lalu kembali ke tombol asal saat ditutup.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
      previous?.focus?.();
    };
  }, []);

  // Escape menutup; Tab berputar di dalam dialog.
  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== "Tab" || !dialogRef.current) return;
    const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  const tab = (active: boolean) =>
    cn(
      "min-h-[44px] rounded-sm px-3 text-sm font-semibold transition-colors",
      active ? "bg-fg text-bg" : "text-muted hover:text-fg",
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-8"
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Preview of ${project.name}`}
        onKeyDown={onKeyDown}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="flex h-full max-h-[860px] w-full max-w-6xl flex-col overflow-hidden rounded-sm border border-line bg-surface text-fg shadow-soft"
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line px-4 py-2">
          <div className="min-w-0 flex-1">
            <p className="truncate font-wide font-bold">{project.name}</p>
            <p className="truncate text-xs text-muted">{liveUrl ? hostOf(liveUrl) : "Screenshot"}</p>
          </div>
          <div className="flex flex-wrap items-center gap-1">
            {liveUrl && (
              <button type="button" aria-pressed={mode === "live"} onClick={() => setMode("live")} className={tab(mode === "live")}>
                Live
              </button>
            )}
            {project.image_url && (
              <button type="button" aria-pressed={mode === "image"} onClick={() => setMode("image")} className={tab(mode === "image")}>
                Screenshot
              </button>
            )}
            {mode === "live" && liveUrl && (
              <button
                type="button"
                aria-pressed={device === "mobile"}
                onClick={() => setDevice(device === "desktop" ? "mobile" : "desktop")}
                className={tab(device === "mobile")}
              >
                Phone width
              </button>
            )}
            <button ref={closeRef} type="button" onClick={onClose} className="btn-ghost ml-1 px-3">
              Close
            </button>
          </div>
        </div>

        <div className="relative flex min-h-0 flex-1 justify-center bg-bg">
          {mode === "live" && liveUrl ? (
            <div
              className={cn(
                "relative h-full",
                device === "desktop" ? "w-full" : "w-[390px] max-w-full border-x border-line",
              )}
            >
              {!loaded && (
                <p className="absolute inset-0 grid place-items-center text-sm text-muted">
                  Loading {hostOf(liveUrl)}
                </p>
              )}
              <iframe
                key={liveUrl}
                src={liveUrl}
                title={`Live preview of ${project.name}`}
                onLoad={() => setLoaded(true)}
                referrerPolicy="no-referrer"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                className="relative h-full w-full bg-white"
              />
            </div>
          ) : project.image_url ? (
            <div className="h-full w-full overflow-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={project.image_url} alt={`Screenshot of ${project.name}`} className="w-full" />
            </div>
          ) : (
            <p className="grid h-full w-full place-items-center p-8 text-center text-sm text-muted">
              This project has no preview yet.
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-2">
          <p className="text-xs text-muted">
            {mode === "live" ? "Blank? Some sites block being shown inside another page. Open it in a new tab instead." : " "}
          </p>
          {liveUrl && (
            <a href={liveUrl} target="_blank" rel="noreferrer" className="btn-primary text-xs">
              Open site in a new tab
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
