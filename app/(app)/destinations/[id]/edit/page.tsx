import { notFound } from "next/navigation";
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
      <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Modifica Destinazione
      </h1>
      <DestinationForm destination={destination} action={updateDestination} />
    </div>
  );
}
