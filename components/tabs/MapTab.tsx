"use client";

import { useEffect, useState } from "react";
import {
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from "@vis.gl/react-google-maps";
import type { Activity } from "@/lib/types";
import { CATEGORY_ICONS, CATEGORY_LABELS } from "@/lib/utils";

const DAY_COLORS = [
  "#ef4444", // red
  "#3b82f6", // blue
  "#22c55e", // green
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#14b8a6", // teal
  "#f97316", // orange
];

function getDayColor(dayNumber: number): string {
  return DAY_COLORS[(dayNumber - 1) % DAY_COLORS.length];
}

interface Props {
  activities: Activity[];
}

function MapContent({ activities }: Props) {
  const map = useMap();
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null,
  );

  const geoActivities = activities.filter(
    (a) => a.latitude != null && a.longitude != null,
  );

  // Auto-fit bounds
  useEffect(() => {
    if (!map || geoActivities.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    geoActivities.forEach((a) => {
      bounds.extend({ lat: a.latitude!, lng: a.longitude! });
    });

    if (geoActivities.length === 1) {
      map.setCenter({ lat: geoActivities[0].latitude!, lng: geoActivities[0].longitude! });
      map.setZoom(14);
    } else {
      map.fitBounds(bounds, { top: 50, bottom: 50, left: 50, right: 50 });
    }
  }, [map, geoActivities]);

  // Draw polylines for same-day activities
  useEffect(() => {
    if (!map) return;

    const polylines: google.maps.Polyline[] = [];

    const dayGroups: Record<number, Activity[]> = {};
    geoActivities.forEach((a) => {
      if (a.day_number != null) {
        if (!dayGroups[a.day_number]) dayGroups[a.day_number] = [];
        dayGroups[a.day_number].push(a);
      }
    });

    Object.entries(dayGroups).forEach(([day, dayActivities]) => {
      if (dayActivities.length < 2) return;

      const path = dayActivities.map((a) => ({
        lat: a.latitude!,
        lng: a.longitude!,
      }));

      const polyline = new google.maps.Polyline({
        path,
        strokeColor: getDayColor(parseInt(day)),
        strokeOpacity: 0.8,
        strokeWeight: 3,
        map,
      });

      polylines.push(polyline);
    });

    return () => {
      polylines.forEach((p) => p.setMap(null));
    };
  }, [map, geoActivities]);

  // Get unique days for legend
  const uniqueDays = Array.from(
    new Set(
      geoActivities
        .filter((a) => a.day_number != null)
        .map((a) => a.day_number!),
    ),
  ).sort((a, b) => a - b);

  if (geoActivities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-3xl mb-2">🗺️</p>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Aggiungi un luogo alle attività per vederle sulla mappa
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="w-full h-[400px] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <Map
          defaultCenter={{ lat: 41.9, lng: 12.5 }}
          defaultZoom={12}
          mapId="talpytravels-map"
          gestureHandling="greedy"
          disableDefaultUI={false}
          className="w-full h-full"
        >
          {geoActivities.map((activity) => (
            <AdvancedMarker
              key={activity.id}
              position={{ lat: activity.latitude!, lng: activity.longitude! }}
              onClick={() => setSelectedActivity(activity)}
            >
              <div
                className="flex items-center justify-center w-8 h-8 rounded-full shadow-lg text-lg"
                style={{
                  backgroundColor:
                    activity.day_number != null
                      ? getDayColor(activity.day_number)
                      : "#6b7280",
                }}
              >
                <span className="text-sm">
                  {CATEGORY_ICONS[activity.category]}
                </span>
              </div>
            </AdvancedMarker>
          ))}

          {selectedActivity && (
            <InfoWindow
              position={{
                lat: selectedActivity.latitude!,
                lng: selectedActivity.longitude!,
              }}
              onCloseClick={() => setSelectedActivity(null)}
            >
              <div className="p-1 min-w-[120px]">
                <p className="font-medium text-sm text-gray-900">
                  {selectedActivity.title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {CATEGORY_ICONS[selectedActivity.category]}{" "}
                  {CATEGORY_LABELS[selectedActivity.category]}
                </p>
                {selectedActivity.place_name && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    📍 {selectedActivity.place_name}
                  </p>
                )}
                {selectedActivity.day_number && (
                  <p
                    className="text-xs font-medium mt-1"
                    style={{
                      color: getDayColor(selectedActivity.day_number),
                    }}
                  >
                    Giorno {selectedActivity.day_number}
                  </p>
                )}
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>

      {/* Day legend */}
      {uniqueDays.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-3">
          {uniqueDays.map((day) => (
            <span
              key={day}
              className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400"
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getDayColor(day) }}
              />
              Giorno {day}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MapTab({ activities }: Props) {
  const geoActivities = activities.filter(
    (a) => a.latitude != null && a.longitude != null,
  );

  if (geoActivities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-3xl mb-2">🗺️</p>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Aggiungi un luogo alle attività per vederle sulla mappa
        </p>
      </div>
    );
  }

  return <MapContent activities={activities} />;
}
