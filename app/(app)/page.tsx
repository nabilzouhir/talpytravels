import { createClient } from "@/lib/supabase-server";
import type { Destination } from "@/lib/types";
import DestinationsList from "@/components/DestinationsList";

export default async function HomePage() {
  const supabase = createClient();

  const { data: destinations } = await supabase
    .from("destinations")
    .select("*, activities(count)")
    .order("created_at", { ascending: false });

  const mapped: Destination[] = (destinations || []).map((d: Record<string, unknown>) => ({
    ...d,
    activity_count: (d.activities as { count: number }[])?.[0]?.count || 0,
  })) as Destination[];

  const wishlist = mapped.filter((d) => d.status === "wishlist");
  const planned = mapped.filter((d) => d.status === "planned");
  const visited = mapped.filter((d) => d.status === "visited");

  return (
    <DestinationsList
      wishlist={wishlist}
      planned={planned}
      visited={visited}
    />
  );
}
