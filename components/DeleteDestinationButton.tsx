"use client";

import { deleteDestination } from "@/lib/actions";

export default function DeleteDestinationButton({ id }: { id: string }) {
  async function handleDelete() {
    if (!confirm("Sei sicuro di voler eliminare questa destinazione?")) return;
    await deleteDestination(id);
  }

  return (
    <button
      onClick={handleDelete}
      className="text-sm px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
    >
      Elimina
    </button>
  );
}
