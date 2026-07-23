"use client";

import { useRef, useState } from "react";
import { FileImage, Loader2, X, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { createEbookBrowserClient, PROOFS_BUCKET } from "@/lib/supabase/ebook";

const MAX_BYTES = 15 * 1024 * 1024;

function fileExt(name: string): string {
  const ext = name.split(".").pop();
  return ext && ext.length <= 5 ? ext.toLowerCase() : "jpg";
}

interface Props {
  value: string | null;
  onChange: (path: string | null) => void;
}

/** Sube la foto del comprobante al bucket privado del Supabase del ebook. */
export default function PaymentProofUpload({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Sube una imagen del comprobante");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("La imagen supera 15 MB");
      return;
    }

    const supabase = createEbookBrowserClient();
    setUploading(true);
    const path = `proofs/${crypto.randomUUID()}.${fileExt(file.name)}`;
    const { error } = await supabase.storage
      .from(PROOFS_BUCKET)
      .upload(path, file, { upsert: false, contentType: file.type });
    setUploading(false);

    if (error) {
      toast.error("No se pudo subir el comprobante. Intenta de nuevo.");
      return;
    }
    setPreview(URL.createObjectURL(file));
    onChange(path);
  }

  function clear() {
    setPreview(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  if (value) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Comprobante"
            className="h-14 w-14 rounded-lg object-cover"
          />
        ) : (
          <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
            <FileImage className="h-6 w-6" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
            <CheckCircle2 className="h-4 w-4" /> Comprobante cargado
          </p>
          <p className="truncate text-xs text-emerald-600/80">
            La doctora lo revisará al verificar tu pago.
          </p>
        </div>
        <button
          type="button"
          onClick={clear}
          className="text-gray-400 hover:text-red-500"
          aria-label="Quitar comprobante"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 p-4 text-sm font-medium text-gray-500 transition-colors hover:border-[#f06292] hover:text-[#f06292] disabled:opacity-60"
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Subiendo…
          </>
        ) : (
          <>
            <FileImage className="h-4 w-4" /> Subir foto del comprobante
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </>
  );
}
