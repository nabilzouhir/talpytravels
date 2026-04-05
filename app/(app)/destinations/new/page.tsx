import { createDestination } from "@/lib/actions";
import DestinationForm from "@/components/DestinationForm";

export default function NewDestinationPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Nuova Destinazione
      </h1>
      <DestinationForm action={createDestination} />
    </div>
  );
}
