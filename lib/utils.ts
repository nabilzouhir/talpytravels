const MONTHS_IT = [
  "gen", "feb", "mar", "apr", "mag", "giu",
  "lug", "ago", "set", "ott", "nov", "dic",
];

export function formatDateIT(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return `${d.getDate()} ${MONTHS_IT[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatDateRangeIT(
  start: string | null,
  end: string | null
): string {
  if (!start && !end) return "";
  if (start && !end) return formatDateIT(start);
  if (!start && end) return formatDateIT(end);

  const s = new Date(start! + "T00:00:00");
  const e = new Date(end! + "T00:00:00");

  if (s.getFullYear() === e.getFullYear()) {
    return `${s.getDate()} ${MONTHS_IT[s.getMonth()]} – ${e.getDate()} ${MONTHS_IT[e.getMonth()]} ${e.getFullYear()}`;
  }

  return `${formatDateIT(start!)} – ${formatDateIT(end!)}`;
}

export function getStorageUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/travel-photos/${path}`;
}

export const CATEGORY_LABELS: Record<string, string> = {
  food: "Cibo",
  sightseeing: "Visite",
  adventure: "Avventura",
  accommodation: "Alloggio",
  transport: "Trasporti",
  other: "Altro",
};

export const CATEGORY_ICONS: Record<string, string> = {
  food: "🍽️",
  sightseeing: "🏛️",
  adventure: "🏔️",
  accommodation: "🏨",
  transport: "🚗",
  other: "📌",
};

export const STATUS_LABELS: Record<string, string> = {
  wishlist: "Wishlist",
  planned: "Pianificato",
  visited: "Visitato",
};

export const STATUS_COLORS: Record<string, string> = {
  wishlist: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  planned: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  visited: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
};
