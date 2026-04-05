"use client";

import { useState } from "react";
import type { Photo } from "@/lib/types";
import { createPhoto, updatePhoto, deletePhoto } from "@/lib/actions";
import { createClient } from "@/lib/supabase-browser";
import { getStorageUrl, formatDateIT } from "@/lib/utils";

interface Props {
  destinationId: string;
  photos: Photo[];
}

export default function PhotosTab({ destinationId, photos }: Props) {
  const [uploading, setUploading] = useState(false);
  const [lightbox, setLightbox] = useState<Photo | null>(null);
  const [editingCaption, setEditingCaption] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    const supabase = createClient();

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${destinationId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage
        .from("travel-photos")
        .upload(path, file);

      if (!error) {
        const formData = new FormData();
        formData.set("destination_id", destinationId);
        formData.set("storage_path", path);
        await createPhoto(formData);
      }
    }

    setUploading(false);
    e.target.value = "";
  }

  async function handleSaveCaption(photo: Photo, caption: string, takenAt: string) {
    const formData = new FormData();
    formData.set("id", photo.id);
    formData.set("destination_id", destinationId);
    formData.set("caption", caption);
    formData.set("taken_at", takenAt);
    await updatePhoto(formData);
    setEditingCaption(false);
  }

  async function handleDelete(photo: Photo) {
    if (!confirm("Eliminare questa foto?")) return;
    await deletePhoto(photo.id, destinationId, photo.storage_path);
    setLightbox(null);
  }

  // Lightbox
  if (lightbox) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => {
              setLightbox(null);
              setEditingCaption(false);
            }}
            className="text-white/80 hover:text-white text-sm"
          >
            ← Chiudi
          </button>
          <button
            onClick={() => handleDelete(lightbox)}
            className="text-red-400 hover:text-red-300 text-sm"
          >
            Elimina
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <img
            src={getStorageUrl(lightbox.storage_path)}
            alt={lightbox.caption || ""}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>
        <div className="p-4">
          {editingCaption ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                handleSaveCaption(
                  lightbox,
                  fd.get("caption") as string,
                  fd.get("taken_at") as string
                );
              }}
              className="space-y-2"
            >
              <input
                name="caption"
                defaultValue={lightbox.caption || ""}
                placeholder="Didascalia"
                className="w-full px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/40 border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
              <input
                name="taken_at"
                type="date"
                defaultValue={lightbox.taken_at || ""}
                className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-accent-600 text-white text-sm rounded-lg"
                >
                  Salva
                </button>
                <button
                  type="button"
                  onClick={() => setEditingCaption(false)}
                  className="px-3 py-1.5 bg-white/10 text-white text-sm rounded-lg"
                >
                  Annulla
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setEditingCaption(true)}
              className="text-left w-full"
            >
              <p className="text-white/90 text-sm">
                {lightbox.caption || (
                  <span className="text-white/40 italic">
                    Aggiungi didascalia...
                  </span>
                )}
              </p>
              {lightbox.taken_at && (
                <p className="text-white/50 text-xs mt-1">
                  {formatDateIT(lightbox.taken_at)}
                </p>
              )}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {photos.length === 0 && !uploading && (
        <div className="text-center py-8">
          <p className="text-3xl mb-2">📷</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Nessuna foto ancora
          </p>
        </div>
      )}

      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {photos.map((photo) => (
            <button
              key={photo.id}
              onClick={() => setLightbox(photo)}
              className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 group"
            >
              <img
                src={getStorageUrl(photo.storage_path)}
                alt={photo.caption || ""}
                className="w-full h-full object-cover"
              />
              {photo.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs truncate">
                    {photo.caption}
                  </p>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Upload */}
      <label className="block w-full py-2 text-sm text-center text-accent-600 dark:text-accent-400 hover:bg-accent-50 dark:hover:bg-accent-900/20 rounded-lg transition-colors font-medium cursor-pointer">
        {uploading ? "Caricamento..." : "+ Carica foto"}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
      </label>
    </div>
  );
}
