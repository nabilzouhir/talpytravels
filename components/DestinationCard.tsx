import Link from "next/link";
import type { Destination } from "@/lib/types";
import { formatDateRangeIT, STATUS_COLORS } from "@/lib/utils";

export default function DestinationCard({
  destination: d,
}: {
  destination: Destination;
}) {
  const dateRange = formatDateRangeIT(d.start_date, d.end_date);

  return (
    <Link
      href={`/destinations/${d.id}`}
      className="block bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:border-gray-300 dark:hover:border-gray-700 transition-colors shadow-sm"
    >
      {d.cover_image_url ? (
        <div className="h-32 bg-gray-100 dark:bg-gray-800">
          <img
            src={d.cover_image_url}
            alt={d.name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="h-20 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
          <span className="text-3xl">🌍</span>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {d.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {d.country}
            </p>
          </div>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${STATUS_COLORS[d.status]}`}
          >
            {d.status === "wishlist"
              ? "Wishlist"
              : d.status === "planned"
              ? "Pianificato"
              : "Visitato"}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 dark:text-gray-500">
          {dateRange && <span>{dateRange}</span>}
          {(d.activity_count ?? 0) > 0 && (
            <span>
              {d.activity_count} attività
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
