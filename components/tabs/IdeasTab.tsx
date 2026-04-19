"use client";

import { useState } from "react";
import type { Activity } from "@/lib/types";
import { updateActivityDay, deleteActivity } from "@/lib/actions";
import { CATEGORY_ICONS, CATEGORY_LABELS } from "@/lib/utils";

interface Props {
  destinationId: string;
  activities: Activity[];
}

// Three fixed buckets
const BUCKETS = [
  {
    key: "hotels",
    label: "Hotel",
    icon: "🏨",
    match: (a: Activity) => a.category === "accommodation",
  },
  {
    key: "restaurants",
    label: "Ristoranti",
    icon: "🍽️",
    match: (a: Activity) => a.category === "food",
  },
  {
    key: "activities",
    label: "Attività",
    icon: "📌",
    match: (a: Activity) =>
      a.category !== "accommodation" && a.category !== "food",
  },
] as const;

export default function IdeasTab({ destinationId, activities }: Props) {
  const [promoting, setPromoting] = useState<Activity | null>(null);
  const [dayValue, setDayValue] = useState("");

  // Only unscheduled (no day_number)
  const unscheduled = activities.filter((a) => a.day_number == null);

  const maxDay = activities.reduce(
    (max, a) => Math.max(max, a.day_number ?? 0),
    0,
  );

  async function handlePromote(e: React.FormEvent) {
    e.preventDefault();
    if (!promoting) return;
    const day = parseInt(dayValue);
    if (!Number.isFinite(day) || day < 1) return;
    await updateActivityDay(promoting.id, day, destinationId);
    setPromoting(null);
    setDayValue("");
  }

  async function handleDelete(activity: Activity) {
    if (!confirm(`Eliminare "${activity.title}"?`)) return;
    await deleteActivity(activity.id, destinationId);
  }

  if (unscheduled.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-3">💡</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
          Nessuna idea in bozza. Aggiungi attività senza un giorno per tenerle
          qui prima di pianificarle.
        </p>
      </div>
    );
  }

  return (
    <div>
      {BUCKETS.map((bucket) => {
        const items = unscheduled.filter(bucket.match);
        if (items.length === 0) return null;

        return (
          <div key={bucket.key} className="mb-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <span>{bucket.icon}</span>
              {bucket.label}
              <span className="text-xs font-normal text-gray-400 dark:text-gray-500">
                {items.length}
              </span>
            </h3>
            <div className="space-y-1">
              {items.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-2 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                >
                  <span className="text-base shrink-0">
                    {CATEGORY_ICONS[activity.category]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white break-words">
                      {activity.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap text-xs text-gray-500 dark:text-gray-400">
                      <span>{CATEGORY_LABELS[activity.category]}</span>
                      {activity.place_name && (
                        <span>📍 {activity.place_name}</span>
                      )}
                      {activity.price != null && activity.price > 0 && (
                        <span>💰 €{activity.price.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => {
                        setPromoting(activity);
                        setDayValue(String(maxDay + 1 || 1));
                      }}
                      className="text-xs px-2.5 py-1 bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 rounded-lg hover:bg-accent-100 dark:hover:bg-accent-900/30 transition-colors font-medium"
                    >
                      Pianifica
                    </button>
                    <button
                      onClick={() => handleDelete(activity)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Elimina"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Promote modal */}
      {promoting && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setPromoting(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl p-5 max-w-sm w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              Pianifica attività
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {promoting.title}
            </p>
            <form onSubmit={handlePromote}>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Giorno
              </label>
              <input
                type="number"
                min="1"
                value={dayValue}
                onChange={(e) => setDayValue(e.target.value)}
                autoFocus
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm"
              />
              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Pianifica
                </button>
                <button
                  type="button"
                  onClick={() => setPromoting(null)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Annulla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
