"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { uploadImage } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

export type Notify = (kind: "ok" | "error", message: string) => void;

/** Tombol hapus dua langkah: klik pertama meminta konfirmasi, klik kedua menghapus. */
export function ConfirmDelete({
  onConfirm,
  disabled,
  label = "Hapus",
}: {
  onConfirm: () => void;
  disabled?: boolean;
  label?: string;
}) {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const id = setTimeout(() => setArmed(false), 3000);
    return () => clearTimeout(id);
  }, [armed]);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        if (armed) {
          setArmed(false);
          onConfirm();
        } else {
          setArmed(true);
        }
      }}
      className={cn(
        "btn px-3 py-2 text-xs",
        armed
          ? "bg-red-500 text-white"
          : "border border-line text-muted hover:border-red-400 hover:text-red-500",
      )}
    >
      <Trash2 className="h-3.5 w-3.5" /> {armed ? "Yakin hapus?" : label}
    </button>
  );
}

/** Input URL gambar + tombol upload ke Supabase Storage + pratinjau. */
export function ImageField({
  id,
  label,
  value,
  onChange,
  folder,
  notify,
  shape = "wide",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder: "avatar" | "projects";
  notify: Notify;
  shape?: "square" | "wide";
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      notify("error", "Ukuran gambar maksimal 4 MB.");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      fd.set("folder", folder);
      const res = await uploadImage(fd);
      if (res.ok && res.data) {
        onChange(res.data);
        notify("ok", "Gambar terunggah. Jangan lupa simpan.");
      } else if (!res.ok) {
        notify("error", res.error);
      }
    } catch {
      notify("error", "Upload gagal. Coba lagi atau tempel URL gambar.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "dots shrink-0 overflow-hidden rounded-xl border border-line bg-bg",
            shape === "square" ? "h-20 w-20" : "h-20 w-32",
          )}
        >
          {value && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <input
            id={id}
            className="input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://… (tempel URL atau upload)"
          />
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
            className="hidden"
            onChange={onFile}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="btn-ghost mt-2 px-3 py-2 text-xs"
          >
            {uploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ImagePlus className="h-3.5 w-3.5" />
            )}
            {uploading ? "Mengunggah…" : "Upload gambar"}
          </button>
        </div>
      </div>
    </div>
  );
}
