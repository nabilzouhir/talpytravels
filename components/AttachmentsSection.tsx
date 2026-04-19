"use client";

import { useRef, useState, useTransition } from "react";
import type { Attachment } from "@/lib/types";
import { createAttachment, deleteAttachment } from "@/lib/actions";
import { getStorageUrl } from "@/lib/utils";

interface Props {
  activityId: string;
  destinationId: string;
  attachments: Attachment[];
}

function isImage(mime: string) {
  return mime.startsWith("image/");
}

function isPdf(mime: string) {
  return mime === "application/pdf";
}

function formatSize(bytes: number | null): string {
  if (bytes == null) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AttachmentsSection({
  activityId,
  destinationId,
  attachments,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("activity_id", activityId);
      fd.append("destination_id", destinationId);
      fd.append("file", file);
      try {
        await createAttachment(fd);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Errore upload");
      }
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleDelete(attachment: Attachment) {
    if (!confirm(`Eliminare "${attachment.filename}"?`)) return;
    startTransition(async () => {
      try {
        await deleteAttachment(attachment.id, attachment.storage_path, destinationId);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Errore eliminazione");
      }
    });
  }

  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
        Allegati (biglietti, PDF, immagini)
      </label>

      {attachments.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-2">
          {attachments.map((att) => {
            const url = getStorageUrl(att.storage_path);
            return (
              <div
                key={att.id}
                className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                  onClick={(e) => e.stopPropagation()}
                >
                  {isImage(att.mime_type) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={url}
                      alt={att.filename}
                      className="w-full h-24 object-cover"
                    />
                  ) : (
                    <div className="w-full h-24 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
                      <span className="text-2xl mb-1">
                        {isPdf(att.mime_type) ? "📄" : "📎"}
                      </span>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">
                        {att.mime_type.split("/")[1] || "file"}
                      </span>
                    </div>
                  )}
                  <div className="p-2">
                    <p className="text-xs text-gray-900 dark:text-white truncate">
                      {att.filename}
                    </p>
                    {att.size_bytes != null && (
                      <p className="text-[10px] text-gray-400 dark:text-gray-500">
                        {formatSize(att.size_bytes)}
                      </p>
                    )}
                  </div>
                </a>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(att);
                  }}
                  disabled={isPending}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/80 text-white text-xs hover:bg-red-600 disabled:opacity-50 transition-colors"
                  title="Elimina"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        multiple
        onChange={handleFileChange}
        disabled={isPending}
        className="block w-full text-xs text-gray-600 dark:text-gray-400
          file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0
          file:text-xs file:font-medium
          file:bg-accent-50 dark:file:bg-accent-900/20
          file:text-accent-700 dark:file:text-accent-400
          hover:file:bg-accent-100 dark:hover:file:bg-accent-900/30
          file:cursor-pointer cursor-pointer"
      />

      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
}
