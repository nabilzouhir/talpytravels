"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Destination } from "@/lib/types";
import EmojiPicker from "./EmojiPicker";

interface Props {
  destination?: Destination;
  action: (formData: FormData) => Promise<void>;
}

export default function DestinationForm({ destination, action }: Props) {
  const router = useRouter();
  const [emoji, setEmoji] = useState(destination?.cover_image_url || "🌍");

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
    </form>
  );
}
