import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { formatDateRangeIT, STATUS_COLORS, STATUS_LABELS } from "@/lib/utils";
import DestinationTabs from "@/components/DestinationTabs";

export default async function DestinationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const [
    { data: destination },
    { data: activities },
    { data: photos },
  ] = await Promise.all([
    supabase.from("destinations").select("*").eq("id", params.id).single(),
    supabase
      .from("activities")
      .select("*")
      .eq("destination_id", params.id)
      .order("created_at", { ascending: true }),
    supabase
      .from("photos")
      .select("*")
      .eq("destination_id", params.id)
      .order("created_at", { ascending: false }),
  ]);

  if (!destination) notFound();

  const dateRange = formatDateRangeIT(
    destination.start_date,
    destination.end_date
  );

  return (
    <div>
      {/* Hero */}
      <div className="-mx-4 -mt-6 h-32 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 relative flex items-center justify-center mb-4">
        <Link
          href="/"
          className="absolute top-3 left-3 inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Indietro
        </Link>
        <span className="text-6xl">{destination.cover_image_url || "🌍"}</span>
      </div>

      {/* Info */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {destination.name}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {destination.country}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[destination.status]}`}
          >
            {STATUS_LABELS[destination.status]}
          </span>
        </div>
      </div>

      {dateRange && (
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-2">
          {dateRange}
        </p>
      )}

      {destination.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {destination.description}
        </p>
      )}

      <div className="flex gap-2 mb-6">
        <Link
          href={`/destinations/${destination.id}/edit`}
          className="text-sm px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Modifica
        </Link>
      </div>

      {/* Tabs */}
      <DestinationTabs
        destinationId={destination.id}
        activities={activities || []}
        photos={photos || []}
        budget={destination.budget}
      />
    </div>
  );
}
