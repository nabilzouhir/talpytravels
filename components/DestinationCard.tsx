import Link from "next/link";
import type { Destination } from "@/lib/types";
import { formatDateRangeIT, STATUS_COLORS } from "@/lib/utils";

export default function DestinationCard({
  destination: d,
}: {
  destination: Destination;
}) {
  const dateRange = formatDateRangeIT(d.start_date, d.end_date);
  const emoji = d.cover_image_url || "🌍";

  return (
    <Link
      href={`/destinations/${d.id}`}
      className="flex items-center gap-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:border-gray-300 dark:hover:border-gray-700 transition-colors shadow-sm"
    >
      <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center shrink-0">
        <span className="text-2xl">{emoji}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {d.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {d.country}
            </p>
          </div>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap shrink-0 ${STATUS_COLORS[d.status]}`}
          >
            {d.status === "wishlist"
              ? "Wishlist"
              : d.status === "planned"
                ? "Pianificato"
                : "Visitato"}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 dark:text-gray-500">
          {dateRange && <span>{dateRange}</span>}
          {(d.activity_count ?? 0) > 0 && (
            <span>{d.activity_count} attività</span>
          )}
        </div>
      </div>
    </Link>
  );
}
