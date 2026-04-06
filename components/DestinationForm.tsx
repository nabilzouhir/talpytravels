"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Destination } from "@/lib/types";
import { deleteDestination } from "@/lib/actions";
import EmojiPicker from "./EmojiPicker";

interface Props {
  destination?: Destination;
  action: (formData: FormData) => Promise<void>;
}

export default function DestinationForm({ destination, action }: Props) {
  const router = useRouter();
  const [emoji, setEmoji] = useState(destination?.cover_image_url || "🌍");

  async function handleDelete() {
    if (!destination) return;
    if (!confirm("Sei sicuro di voler eliminare questa destinazione?")) return;
    await deleteDestination(destination.id);
  }

  return (
    <form action={action} className="space-y-4">
      {destination && <input type="hidden" name="id" value={destination.id} />}
      <input type="hidden" name="cover_image_url" value={emoji} />

      {/* Emoji picker */}
      <EmojiPicker value={emoji} onChange={setEmoji} />

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Nome *
        </label>
        <input
          name="name"
          required
          defaultValue={destination?.name}
          placeholder="es. Roma, Kyoto..."
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
        />
      </div>

      {/* Country */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Paese *
        </label>
        <input
          name="country"
          required
          defaultValue={destination?.country}
          placeholder="es. Italia, Giappone..."
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Descrizione
        </label>
        <textarea
          name="description"
          rows={3}
          defaultValue={destination?.description || ""}
          placeholder="Appunti, idee, motivazione..."
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Stato *
        </label>
        <select
          name="status"
          defaultValue={destination?.status || "wishlist"}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
        >
          <option value="wishlist">Wishlist</option>
          <option value="planned">Pianificato</option>
          <option value="visited">Visitato</option>
        </select>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Data inizio
          </label>
          <input
            name="start_date"
            type="date"
            defaultValue={destination?.start_date || ""}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Data fine
          </label>
          <input
            name="end_date"
            type="date"
            defaultValue={destination?.end_date || ""}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Budget */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Budget (opzionale)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
          <input
            name="budget"
            type="number"
            min="0"
            step="0.01"
            defaultValue={destination?.budget ?? ""}
            placeholder="es. 1500.00"
            className="w-full pl-7 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white font-medium rounded-lg transition-colors"
        >
          Salva
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Annulla
        </button>
      </div>

      {/* Delete button (only in edit mode) */}
      {destination && (
        <button
          type="button"
          onClick={handleDelete}
          className="w-full py-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors font-medium"
        >
          Elimina destinazione
        </button>
      )}
    </form>
  );
}
