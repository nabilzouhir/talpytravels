"use client";

import { useState } from "react";
import type { Destination } from "@/lib/types";
import DestinationCard from "./DestinationCard";

interface Props {
  wishlist: Destination[];
  planned: Destination[];
  visited: Destination[];
}

function Section({
  title,
  emoji,
  destinations,
  defaultOpen = true,
}: {
  title: string;
  emoji: string;
  destinations: Destination[];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="mb-6">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full text-left py-2"
      >
        <span
          className={`text-xs text-gray-400 transition-transform ${
            open ? "rotate-90" : ""
          }`}
        >
          ▶
        </span>
        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          {emoji} {title}
        </span>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {destinations.length}
        </span>
      </button>
      {open && (
        <div className="mt-2 space-y-3">
          {destinations.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500 py-4 text-center">
              Nessuna destinazione qui ✨
            </p>
          ) : (
            destinations.map((d) => (
              <DestinationCard key={d.id} destination={d} />
            ))
          )}
        </div>
      )}
    </section>
  );
}

export default function DestinationsList({
  wishlist,
  planned,
  visited,
}: Props) {
  return (
    <div>
      <Section title="Wishlist" emoji="💭" destinations={wishlist} />
      <Section title="Pianificati" emoji="📅" destinations={planned} />
      <Section title="Visitati" emoji="✅" destinations={visited} />
    </div>
  );
}
