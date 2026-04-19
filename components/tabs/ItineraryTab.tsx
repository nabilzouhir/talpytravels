"use client";

import { useState, useEffect } from "react";
import type { Activity } from "@/lib/types";
import { updateActivityDay, reorderActivities } from "@/lib/actions";
import { CATEGORY_ICONS, formatDayWithDate } from "@/lib/utils";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  destinationId: string;
  activities: Activity[];
  startDate?: string | null;
}

interface RowProps {
  activity: Activity;
  onSetDay: (a: Activity, day: number | null) => void;
  dayNum: number;
}

function SortableRow({ activity, onSetDay, dayNum }: RowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: activity.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-1 py-1.5 group"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 cursor-grab active:cursor-grabbing touch-none shrink-0 px-0.5"
        title="Trascina per riordinare"
        aria-label="Trascina per riordinare"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M7 4a1 1 0 100 2 1 1 0 000-2zm0 5a1 1 0 100 2 1 1 0 000-2zm0 5a1 1 0 100 2 1 1 0 000-2zm6-10a1 1 0 100 2 1 1 0 000-2zm0 5a1 1 0 100 2 1 1 0 000-2zm0 5a1 1 0 100 2 1 1 0 000-2z" />
        </svg>
      </button>
      <span className="text-sm shrink-0">{CATEGORY_ICONS[activity.category]}</span>
      <span
        className={`text-sm flex-1 min-w-0 truncate ${
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
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() =>
            onSetDay(activity, dayNum > 1 ? dayNum - 1 : null)
          }
          className="w-6 h-6 rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Sposta al giorno precedente"
        >
          −
        </button>
        <button
          onClick={() => onSetDay(activity, dayNum + 1)}
          className="w-6 h-6 rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Sposta al giorno successivo"
        >
          +
        </button>
        <button
          onClick={() => onSetDay(activity, null)}
          className="w-6 h-6 rounded text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
          title="Rimuovi dal giorno"
        >
          ×
        </button>
      </div>
    </div>
  );
}

interface DayGroupProps {
  dayNum: number;
  items: Activity[];
  startDate?: string | null;
  destinationId: string;
  onSetDay: (a: Activity, day: number | null) => void;
}

function DayGroup({
  dayNum,
  items,
  startDate,
  destinationId,
  onSetDay,
}: DayGroupProps) {
  const [localItems, setLocalItems] = useState(items);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = localItems.findIndex((i) => i.id === active.id);
    const newIndex = localItems.findIndex((i) => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const next = arrayMove(localItems, oldIndex, newIndex);
    setLocalItems(next);
    await reorderActivities(
      next.map((a) => a.id),
      destinationId,
    );
  }

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
        {formatDayWithDate(startDate, dayNum) || `Giorno ${dayNum}`}
      </h3>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={localItems.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-1 pl-3 border-l-2 border-accent-200 dark:border-accent-800">
            {localItems.map((activity) => (
              <SortableRow
                key={activity.id}
                activity={activity}
                onSetDay={onSetDay}
                dayNum={dayNum}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default function ItineraryTab({
  destinationId,
  activities,
  startDate,
}: Props) {
  const assigned = activities.filter((a) => a.day_number !== null);
  const unassigned = activities.filter((a) => a.day_number === null);

  const maxDay = assigned.reduce(
    (max, a) => Math.max(max, a.day_number!),
    0,
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

      {Array.from({ length: maxDay }, (_, i) => i + 1).map((dayNum) => (
        <DayGroup
          key={dayNum}
          dayNum={dayNum}
          items={days[dayNum] || []}
          startDate={startDate}
          destinationId={destinationId}
          onSetDay={handleSetDay}
        />
      ))}

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
