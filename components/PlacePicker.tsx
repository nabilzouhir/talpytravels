"use client";

import { useEffect, useRef, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

interface Props {
  defaultPlaceName?: string | null;
  defaultLatitude?: number | null;
  defaultLongitude?: number | null;
}

export default function PlacePicker({
  defaultPlaceName,
  defaultLatitude,
  defaultLongitude,
}: Props) {
  const placesLib = useMapsLibrary("places");
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const [placeName, setPlaceName] = useState(defaultPlaceName || "");
  const [latitude, setLatitude] = useState<number | null>(
    defaultLatitude ?? null,
  );
  const [longitude, setLongitude] = useState<number | null>(
    defaultLongitude ?? null,
  );

  useEffect(() => {
    if (!placesLib || !inputRef.current) return;

    const autocomplete = new placesLib.Autocomplete(inputRef.current, {
      fields: ["geometry", "name", "formatted_address"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const name = place.name || place.formatted_address || "";
        setLatitude(lat);
        setLongitude(lng);
        setPlaceName(name);
      }
    });

    autocompleteRef.current = autocomplete;

    return () => {
      google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [placesLib]);

  function handleClear() {
    setPlaceName("");
    setLatitude(null);
    setLongitude(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
        Luogo (opzionale)
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          defaultValue={defaultPlaceName || ""}
          placeholder="Cerca un luogo..."
          className="w-full px-3 py-2 pr-8 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm"
        />
        {placeName && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
      {/* Hidden fields for FormData */}
      <input type="hidden" name="place_name" value={placeName} />
      <input type="hidden" name="latitude" value={latitude ?? ""} />
      <input type="hidden" name="longitude" value={longitude ?? ""} />
    </div>
  );
}
