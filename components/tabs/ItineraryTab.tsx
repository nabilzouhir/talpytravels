"use client";

import type { Activity } from "@/lib/types";
import { updateActivityDay } from "@/lib/actions";
import { CATEGORY_ICONS } from "@/lib/utils";

interface Props {
  destinationId: string;
  activities: Activity[];
}

export default function ItineraryTab({ destinationId, activities }: Props) {
  const assigned = activities.filter((a) => a.day_number !== null);
  const unassigned = activities.filter((a) => a.day_number === null);

  const maxDay = assigned.reduce(
    (max, a) => Math.max(max, a.day_number!),
    0
  );

  const days: Record<number, Activity[]> = {};
  for (const a of assigned) {
    const d = a.day_number!;
    if (!days[d]) days[d] = [];
    days[d].push(a);
  }

  async function handleSetDay(activity: Activity, day: number | null) {
    await updateActivityDay(activity.id, day, destinationId);
  }

  return (
    <div>
      {assigned.length === 0 && unassigned.length === 0 && (
        <div className="text-center py-8">
          <p className="text-3xl mb-2">🗓️</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Aggiungi attività per creare l&apos;itinerario
          </p>
        </div>
      )}

      {/* Days */}
      {Array.from({ length: maxDay }, (_, i) => i + 1).map((dayNum) => (
        <div key={dayNum} className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Giorno {dayNum}
          </h3>
          <div className="space-y-1 pl-3 border-l-2 border-accent-200 dark:border-accent-800">
            {(days[dayNum] || []).map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-2 py-1.5 group"
              >
                <span className="text-sm">
                  {CATEGORY_ICONS[activity.category]}
                </span>
                <span
                  className={`text-sm flex-1 ${
                    activity.done
                      ? "line-through text-gray-400"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {activity.title}
                  {activity.place_name && (
                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">
                      📍
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() =>
                      handleSetDay(
                        activity,
                        dayNum > 1 ? dayNum - 1 : null
                      )
                    }
                    className="w-6 h-6 rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
                    title="Sposta al giorno precedente"
                  >
                    −
                  </button>
                  <button
                    onClick={() => handleSetDay(activity, dayNum + 1)}
                    className="w-6 h-6 rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
                    title="Sposta al giorno successivo"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleSetDay(activity, null)}
                    className="w-6 h-6 rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
                    title="Rimuovi dal giorno"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Unassigned */}
      {unassigned.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            Non assegnate
          </h3>
          <div className="space-y-1">
            {unassigned.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-2 py-1.5 group"
              >
                <span className="text-sm">
                  {CATEGORY_ICONS[activity.category]}
                </span>
                <span className="text-sm flex-1 text-gray-600 dark:text-gray-400">
                  {activity.title}
                </span>
                <button
                  onClick={() => handleSetDay(activity, maxDay + 1 || 1)}
                  className="opacity-0 group-hover:opacity-100 text-xs px-2 py-1 bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 rounded-lg hover:bg-accent-100 dark:hover:bg-accent-900/30 transition-all"
                >
                  Giorno {maxDay + 1 || 1}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
