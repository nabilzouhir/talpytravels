import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { updateDestination } from "@/lib/actions";
import DestinationForm from "@/components/DestinationForm";

export default async function EditDestinationPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data: destination } = await supabase
    .from("destinations")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!destination) notFound();

  return (
    <div>
      <Link
        href={`/destinations/${params.id}`}
        className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-4 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Indietro
      </Link>
      <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Modifica Destinazione
      </h1>
      <DestinationForm destination={destination} action={updateDestination} />
    </div>
  );
}
