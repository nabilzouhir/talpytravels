"use client";

import { useState } from "react";
import type { Activity, ActivityCategory } from "@/lib/types";
import {
  createActivity,
  toggleActivity,
  deleteActivity,
} from "@/lib/actions";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/utils";

interface Props {
  destinationId: string;
  activities: Activity[];
}

const CATEGORIES: ActivityCategory[] = [
  "food",
  "sightseeing",
  "adventure",
  "accommodation",
  "transport",
  "other",
];

export default function ActivitiesTab({ destinationId, activities }: Props) {
  const [showForm, setShowForm] = useState(false);

  const grouped = CATEGORIES.reduce((acc, cat) => {
    const items = activities.filter((a) => a.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {} as Record<string, Activity[]>);

  async function handleToggle(activity: Activity) {
    await toggleActivity(activity.id, !activity.done, destinationId);
  }

  async function handleDelete(activity: Activity) {
    if (!confirm(`Eliminare "${activity.title}"?`)) return;
    await deleteActivity(activity.id, destinationId);
  }

  return (
    <div>
      {Object.keys(grouped).length === 0 && !showForm && (
        <div className="text-center py-8">
          <p className="text-3xl mb-2">📋</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Nessuna attività ancora
          </p>
        </div>
      )}

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="mb-4">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            {CATEGORY_ICONS[category]} {CATEGORY_LABELS[category]}
          </h3>
          <div className="space-y-1">
            {items.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 group"
              >
                <button
                  onClick={() => handleToggle(activity)}
                  className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                    activity.done
                      ? "bg-accent-500 border-accent-500 text-white"
                      : "border-gray-300 dark:border-gray-600 hover:border-accent-400"
                  }`}
                >
                  {activity.done && (
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm ${
                      activity.done
                        ? "line-through text-gray-400 dark:text-gray-500"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {activity.title}
                  </p>
                  {activity.notes && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {activity.notes}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(activity)}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1"
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
            ))}
          </div>
        </div>
      ))}

      {/* Add form */}
      {showForm ? (
        <form
          action={async (formData) => {
            await createActivity(formData);
            setShowForm(false);
          }}
          className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3"
        >
          <input type="hidden" name="destination_id" value={destinationId} />
          <input
            name="title"
            required
            placeholder="Titolo attività"
            autoFocus
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm"
          />
          <select
            name="category"
            defaultValue="other"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>
          <textarea
            name="notes"
            placeholder="Note (opzionale)"
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm resize-none"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-1.5 bg-accent-600 hover:bg-accent-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Aggiungi
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Annulla
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-2 text-sm text-accent-600 dark:text-accent-400 hover:bg-accent-50 dark:hover:bg-accent-900/20 rounded-lg transition-colors font-medium"
        >
          + Aggiungi attività
        </button>
      )}
    </div>
  );
}
