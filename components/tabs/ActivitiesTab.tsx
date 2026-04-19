"use client";

import { useState } from "react";
import type { Activity, ActivityCategory } from "@/lib/types";
import {
  createActivity,
  updateActivity,
  toggleActivity,
  deleteActivity,
} from "@/lib/actions";
import { CATEGORY_LABELS, CATEGORY_ICONS, PAYER_LABELS, PAYER_ICONS } from "@/lib/utils";
import PlacePicker from "@/components/PlacePicker";

interface Props {
  destinationId: string;
  activities: Activity[];
  budget?: number | null;
}

const CATEGORIES: ActivityCategory[] = [
  "food",
  "sightseeing",
  "hiking",
  "adventure",
  "accommodation",
  "chill",
  "transport",
  "other",
];

function LinkifiedText({ text }: { text: string }) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return (
    <>
      {parts.map((part, i) =>
        urlRegex.test(part) ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-500 dark:text-accent-400 underline break-all"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

export default function ActivitiesTab({ destinationId, activities, budget }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const grouped = CATEGORIES.reduce(
    (acc, cat) => {
      const items = activities.filter((a) => a.category === cat);
      if (items.length > 0) acc[cat] = items;
      return acc;
    },
    {} as Record<string, Activity[]>,
  );

  // Compute max day for day_number suggestions
  const maxDay = activities.reduce(
    (max, a) => Math.max(max, a.day_number ?? 0),
    0,
  );

  // Compute total price for budget alert
  const totalPrice = activities.reduce((sum, a) => sum + (a.price ?? 0), 0);
  const overBudget = budget != null && budget > 0 && totalPrice > budget;

  async function handleToggle(activity: Activity, e: React.MouseEvent) {
    e.stopPropagation();
    await toggleActivity(activity.id, !activity.done, destinationId);
  }

  async function handleDelete(activity: Activity) {
    if (!confirm(`Eliminare "${activity.title}"?`)) return;
    await deleteActivity(activity.id, destinationId);
    setEditingActivity(null);
  }

  // Edit or Create form
  if (showForm || editingActivity) {
    const isEditing = !!editingActivity;
    return (
      <form
        action={async (formData) => {
          if (isEditing) {
            await updateActivity(formData);
          } else {
            await createActivity(formData);
          }
          setShowForm(false);
          setEditingActivity(null);
        }}
        className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3"
      >
        <input type="hidden" name="destination_id" value={destinationId} />
        {editingActivity && (
          <input type="hidden" name="id" value={editingActivity.id} />
        )}
        <input
          name="title"
          required
          placeholder="Titolo attività"
          defaultValue={editingActivity?.title}
          autoFocus
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm"
        />
        <select
          name="category"
          defaultValue={editingActivity?.category || "other"}
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
          defaultValue={editingActivity?.notes || ""}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm resize-none"
        />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Giorno (opzionale)
            </label>
            <input
              name="day_number"
              type="number"
              min="1"
              placeholder={`es. ${maxDay + 1 || 1}`}
              defaultValue={editingActivity?.day_number ?? ""}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Prezzo (opzionale)
            </label>
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              placeholder="es. 25.00"
              defaultValue={editingActivity?.price ?? ""}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Pagato da (opzionale)
          </label>
          <select
            name="paid_by"
            defaultValue={editingActivity?.paid_by ?? ""}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm"
          >
            <option value="">— Nessuno —</option>
            <option value="pesciolino">{PAYER_ICONS.pesciolino} {PAYER_LABELS.pesciolino}</option>
            <option value="talpina">{PAYER_ICONS.talpina} {PAYER_LABELS.talpina}</option>
          </select>
        </div>
        <PlacePicker
          defaultPlaceName={editingActivity?.place_name}
          defaultLatitude={editingActivity?.latitude}
          defaultLongitude={editingActivity?.longitude}
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-1.5 bg-accent-600 hover:bg-accent-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {isEditing ? "Salva" : "Aggiungi"}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowForm(false);
              setEditingActivity(null);
            }}
            className="px-4 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Annulla
          </button>
        </div>

        {/* Delete button at bottom of edit form */}
        {isEditing && (
          <button
            type="button"
            onClick={() => handleDelete(editingActivity!)}
            className="w-full mt-2 py-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors font-medium"
          >
            Elimina attività
          </button>
        )}
      </form>
    );
  }

  return (
    <div>
      {/* Budget alert */}
      {overBudget && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2">
          <span className="text-lg">⚠️</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-red-700 dark:text-red-400">
              Budget superato
            </p>
            <p className="text-xs text-red-600 dark:text-red-400/80">
              Totale: €{totalPrice.toFixed(2)} / Budget: €{budget!.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* Budget summary (when not over budget but budget is set) */}
      {budget != null && budget > 0 && !overBudget && totalPrice > 0 && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-2">
          <span className="text-lg">✅</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-green-700 dark:text-green-400">
              €{totalPrice.toFixed(2)} / €{budget.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {Object.keys(grouped).length === 0 && (
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
                onClick={() => setEditingActivity(activity)}
                className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer active:bg-gray-100 dark:active:bg-gray-800 transition-colors"
              >
                <button
                  onClick={(e) => handleToggle(activity, e)}
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
                    className={`text-sm break-words ${
                      activity.done
                        ? "line-through text-gray-400 dark:text-gray-500"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {activity.title}
                  </p>
                  {activity.notes && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 break-words">
                      <LinkifiedText text={activity.notes} />
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    {activity.place_name && (
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        📍 {activity.place_name}
                      </span>
                    )}
                    {activity.price != null && activity.price > 0 && (
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        💰 €{activity.price.toFixed(2)}
                        {activity.paid_by && (
                          <> · {PAYER_ICONS[activity.paid_by]} {PAYER_LABELS[activity.paid_by]}</>
                        )}
                      </span>
                    )}
                  </div>
                  {activity.day_number && (
                    <p className="text-xs text-accent-500 dark:text-accent-400 mt-0.5">
                      Giorno {activity.day_number}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={() => setShowForm(true)}
        className="w-full py-2 text-sm text-accent-600 dark:text-accent-400 hover:bg-accent-50 dark:hover:bg-accent-900/20 rounded-lg transition-colors font-medium"
      >
        + Aggiungi attività
      </button>
    </div>
  );
}
