"use client";

import { useState } from "react";
import type { Flight } from "@/lib/types";
import { createFlight, updateFlight, deleteFlight } from "@/lib/actions";
import { PAYER_LABELS, PAYER_ICONS } from "@/lib/utils";

interface Props {
  destinationId: string;
  flights: Flight[];
}

function formatDateTime(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toLocalInputValue(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function FlightsTab({ destinationId, flights }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Flight | null>(null);

  async function handleDelete(flight: Flight) {
    if (!confirm(`Eliminare il volo ${flight.flight_number || ""}?`)) return;
    await deleteFlight(flight.id, destinationId);
    setEditing(null);
  }

  if (showForm || editing) {
    const isEditing = !!editing;
    return (
      <form
        action={async (formData) => {
          if (isEditing) {
            await updateFlight(formData);
          } else {
            await createFlight(formData);
          }
          setShowForm(false);
          setEditing(null);
        }}
        className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3"
      >
        <input type="hidden" name="destination_id" value={destinationId} />
        {editing && <input type="hidden" name="id" value={editing.id} />}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Compagnia
            </label>
            <input
              name="airline"
              placeholder="es. ITA Airways"
              defaultValue={editing?.airline || ""}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Numero volo
            </label>
            <input
              name="flight_number"
              placeholder="es. AZ1234"
              defaultValue={editing?.flight_number || ""}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Partenza (da)
            </label>
            <input
              name="departure_airport"
              placeholder="es. FCO"
              defaultValue={editing?.departure_airport || ""}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm uppercase"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Arrivo (a)
            </label>
            <input
              name="arrival_airport"
              placeholder="es. LHR"
              defaultValue={editing?.arrival_airport || ""}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm uppercase"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Data/ora partenza
            </label>
            <input
              name="departure_at"
              type="datetime-local"
              defaultValue={toLocalInputValue(editing?.departure_at || null)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Data/ora arrivo
            </label>
            <input
              name="arrival_at"
              type="datetime-local"
              defaultValue={toLocalInputValue(editing?.arrival_at || null)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Codice prenotazione
          </label>
          <input
            name="confirmation_code"
            placeholder="es. ABC123"
            defaultValue={editing?.confirmation_code || ""}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm uppercase"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Prezzo (opzionale)
            </label>
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              placeholder="es. 120.00"
              defaultValue={editing?.price ?? ""}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Pagato da (opzionale)
            </label>
            <select
              name="paid_by"
              defaultValue={editing?.paid_by ?? ""}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm"
            >
              <option value="">— Nessuno —</option>
              <option value="pesciolino">
                {PAYER_ICONS.pesciolino} {PAYER_LABELS.pesciolino}
              </option>
              <option value="talpina">
                {PAYER_ICONS.talpina} {PAYER_LABELS.talpina}
              </option>
            </select>
          </div>
        </div>

        <textarea
          name="notes"
          placeholder="Note (opzionale)"
          rows={2}
          defaultValue={editing?.notes || ""}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm resize-none"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-1.5 bg-accent-600 hover:bg-accent-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {isEditing ? "Salva" : "Aggiungi"}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowForm(false);
              setEditing(null);
            }}
            className="px-4 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Annulla
          </button>
        </div>

        {isEditing && (
          <button
            type="button"
            onClick={() => handleDelete(editing!)}
            className="w-full mt-2 py-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors font-medium"
          >
            Elimina volo
          </button>
        )}
      </form>
    );
  }

  return (
    <div>
      {flights.length === 0 && (
        <div className="text-center py-8">
          <p className="text-3xl mb-2">✈️</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Nessun volo aggiunto
          </p>
        </div>
      )}

      <div className="space-y-2">
        {flights.map((flight) => (
          <div
            key={flight.id}
            onClick={() => setEditing(flight)}
            className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-lg shrink-0">✈️</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {flight.airline || "Volo"}
                    {flight.flight_number && (
                      <span className="text-gray-400 dark:text-gray-500">
                        {" · "}
                        {flight.flight_number}
                      </span>
                    )}
                  </p>
                  {(flight.departure_airport || flight.arrival_airport) && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {flight.departure_airport || "—"} → {flight.arrival_airport || "—"}
                    </p>
                  )}
                </div>
              </div>
              {flight.price != null && (
                <div className="text-sm font-semibold text-gray-900 dark:text-white shrink-0">
                  €{flight.price.toFixed(2)}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 flex-wrap text-xs text-gray-500 dark:text-gray-400">
              {flight.departure_at && (
                <span>🛫 {formatDateTime(flight.departure_at)}</span>
              )}
              {flight.arrival_at && (
                <span>🛬 {formatDateTime(flight.arrival_at)}</span>
              )}
              {flight.confirmation_code && (
                <span className="font-mono uppercase">
                  {flight.confirmation_code}
                </span>
              )}
              {flight.paid_by && (
                <span>
                  {PAYER_ICONS[flight.paid_by]} {PAYER_LABELS[flight.paid_by]}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setShowForm(true)}
        className="w-full mt-3 py-2 text-sm text-accent-600 dark:text-accent-400 hover:bg-accent-50 dark:hover:bg-accent-900/20 rounded-lg transition-colors font-medium"
      >
        + Aggiungi volo
      </button>
    </div>
  );
}
