"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Image as ImageIcon, Monitor, Smartphone, X } from "lucide-react";
import type { Project } from "@/lib/types";
import { cn, ensureUrl, hostOf } from "@/lib/utils";

type Mode = "live" | "image";
type Device = "desktop" | "mobile";

/** Mockup browser berisi iFrame live (atau gambar) sebelum membuka link asli. */
export function PreviewModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const liveUrl = ensureUrl(project.live_url);
  const [mode, setMode] = useState<Mode>(liveUrl ? "live" : "image");
  const [device, setDevice] = useState<Device>("desktop");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const tab = (active: boolean) =>
    cn(
      "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition",
      active ? "bg-accent text-white" : "text-muted hover:text-fg",
    );

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Preview ${project.name}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-8"
    >
      <motion.div
        initial={{ y: 24, scale: 0.97, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 24, scale: 0.97, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="flex h-full max-h-[860px] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-2xl"
      >
        {/* Chrome browser */}
        <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            <span className="h-3 w-3 rounded-full bg-amber-400" />
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
          </div>
          <div className="min-w-0 flex-1 truncate rounded-lg bg-bg px-3 py-1.5 font-mono text-xs text-muted">
            {liveUrl ? hostOf(liveUrl) : project.name}
          </div>
          <div className="flex items-center gap-1">
            {liveUrl && (
              <button type="button" onClick={() => setMode("live")} className={tab(mode === "live")}>
                <Monitor className="h-3.5 w-3.5" /> Live
              </button>
            )}
            {project.image_url && (
              <button type="button" onClick={() => setMode("image")} className={tab(mode === "image")}>
                <ImageIcon className="h-3.5 w-3.5" /> Image
              </button>
            )}
            {mode === "live" && (
              <button
                type="button"
                onClick={() => setDevice(device === "desktop" ? "mobile" : "desktop")}
                className={tab(false)}
                aria-label="Switch device size"
              >
                {device === "desktop" ? (
                  <Smartphone className="h-3.5 w-3.5" />
                ) : (
                  <Monitor className="h-3.5 w-3.5" />
                )}
                <span className="hidden sm:inline">{device === "desktop" ? "Mobile" : "Desktop"}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close preview"
              className="ml-1 grid h-8 w-8 place-items-center rounded-lg text-muted transition hover:bg-bg hover:text-fg"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Viewport */}
        <div className="relative flex min-h-0 flex-1 justify-center bg-bg">
          {mode === "live" && liveUrl ? (
            <div
              className={cn(
                "relative h-full transition-[width] duration-300",
                device === "desktop" ? "w-full" : "w-[390px] max-w-full border-x border-line",
              )}
            >
              {!loaded && (
                <div className="absolute inset-0 grid place-items-center font-mono text-xs text-muted">
                  loading {hostOf(liveUrl)}…
                </div>
              )}
              <iframe
                key={liveUrl}
                src={liveUrl}
                title={`Live preview ${project.name}`}
                onLoad={() => setLoaded(true)}
                loading="lazy"
                referrerPolicy="no-referrer"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                className="relative h-full w-full bg-white"
              />
            </div>
          ) : project.image_url ? (
            <div className="h-full w-full overflow-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={project.image_url} alt={`${project.name} screenshot`} className="w-full" />
            </div>
          ) : (
            <div className="grid h-full w-full place-items-center p-8 text-center text-sm text-muted">
              This project has no live link or preview image yet.
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3">
          <p className="text-xs text-muted">
            {mode === "live"
              ? "Blank preview? Some sites refuse to load inside a frame — open it in a new tab."
              : project.name}
          </p>
          {liveUrl && (
            <a href={liveUrl} target="_blank" rel="noreferrer" className="btn-primary px-3.5 py-2 text-xs">
              Open site <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
