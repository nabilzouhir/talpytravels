"use client";

import { useState } from "react";
import type { DiaryEntry, Photo } from "@/lib/types";
import {
  createDiaryEntry,
  updateDiaryEntry,
  deleteDiaryEntry,
} from "@/lib/actions";
import { formatDateIT, getStorageUrl } from "@/lib/utils";

interface Props {
  destinationId: string;
  entries: DiaryEntry[];
  photos: Photo[];
}

export default function DiaryTab({ destinationId, entries, photos }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [viewEntry, setViewEntry] = useState<DiaryEntry | null>(null);
  const [editEntry, setEditEntry] = useState<DiaryEntry | null>(null);

  async function handleDelete(entry: DiaryEntry) {
    if (!confirm(`Eliminare "${entry.title}"?`)) return;
    await deleteDiaryEntry(entry.id, destinationId);
    setViewEntry(null);
  }

  // View mode
  if (viewEntry) {
    const entryPhotos = photos.filter(
      (p) => p.diary_entry_id === viewEntry.id
    );
    return (
      <div>
        <button
          onClick={() => setViewEntry(null)}
          className="text-sm text-accent-600 dark:text-accent-400 mb-4 hover:underline"
        >
          ← Torna al diario
        </button>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {viewEntry.title}
        </h2>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
          {formatDateIT(viewEntry.entry_date)}
        </p>
        <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
          {viewEntry.body}
        </div>
        {entryPhotos.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mt-4">
            {entryPhotos.map((photo) => (
              <img
                key={photo.id}
                src={getStorageUrl(photo.storage_path)}
                alt={photo.caption || ""}
                className="rounded-lg w-full aspect-square object-cover"
              />
            ))}
          </div>
        )}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => {
              setEditEntry(viewEntry);
              setViewEntry(null);
            }}
            className="text-sm px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Modifica
          </button>
          <button
            onClick={() => handleDelete(viewEntry)}
            className="text-sm px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30"
          >
            Elimina
          </button>
        </div>
      </div>
    );
  }

  // Form mode (new or edit)
  if (showForm || editEntry) {
    const isEditing = !!editEntry;
    return (
      <form
        action={async (formData) => {
          if (isEditing) {
            await updateDiaryEntry(formData);
          } else {
            await createDiaryEntry(formData);
          }
          setShowForm(false);
          setEditEntry(null);
        }}
        className="space-y-3"
      >
        <input type="hidden" name="destination_id" value={destinationId} />
        {editEntry && (
          <input type="hidden" name="id" value={editEntry.id} />
        )}

        <input
          name="title"
          required
          placeholder="Titolo"
          defaultValue={editEntry?.title}
          autoFocus
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm"
        />
        <input
          name="entry_date"
          type="date"
          required
          defaultValue={
            editEntry?.entry_date || new Date().toISOString().split("T")[0]
          }
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm"
        />
        <textarea
          name="body"
          required
          placeholder="Racconta la giornata..."
          rows={8}
          defaultValue={editEntry?.body}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm resize-none"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-1.5 bg-accent-600 hover:bg-accent-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {isEditing ? "Aggiorna" : "Salva"}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowForm(false);
              setEditEntry(null);
            }}
            className="px-4 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Annulla
          </button>
        </div>
      </form>
    );
  }

  // List mode
  return (
    <div>
      {entries.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-3xl mb-2">📝</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Nessuna voce nel diario
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <button
              key={entry.id}
              onClick={() => setViewEntry(entry)}
              className="w-full text-left p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  {entry.title}
                </h3>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {formatDateIT(entry.entry_date)}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                {entry.body}
              </p>
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => setShowForm(true)}
        className="w-full mt-3 py-2 text-sm text-accent-600 dark:text-accent-400 hover:bg-accent-50 dark:hover:bg-accent-900/20 rounded-lg transition-colors font-medium"
      >
        + Nuova voce
      </button>
    </div>
  );
}
