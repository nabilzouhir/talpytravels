"use client";

import { useState } from "react";
import type { Activity, Photo } from "@/lib/types";
import ActivitiesTab from "./tabs/ActivitiesTab";
import ItineraryTab from "./tabs/ItineraryTab";
import PhotosTab from "./tabs/PhotosTab";

const TABS = [
  { key: "activities", label: "Attività" },
  { key: "itinerary", label: "Itinerario" },
  { key: "photos", label: "Foto" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

interface Props {
  destinationId: string;
  activities: Activity[];
  photos: Photo[];
}

export default function DestinationTabs({
  destinationId,
  activities,
  photos,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("activities");

  return (
    <div>
      {/* Tab pills */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-4 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 min-w-0 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "activities" && (
        <ActivitiesTab
          destinationId={destinationId}
          activities={activities}
        />
      )}
      {activeTab === "itinerary" && (
        <ItineraryTab
          destinationId={destinationId}
          activities={activities}
        />
      )}
      {activeTab === "photos" && (
        <PhotosTab destinationId={destinationId} photos={photos} />
      )}
    </div>
  );
}
