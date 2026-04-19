"use client";

import type { Activity, Flight } from "@/lib/types";
import { PAYER_LABELS, PAYER_ICONS } from "@/lib/utils";

interface Props {
  activities: Activity[];
  flights?: Flight[];
}

interface Expense {
  id: string;
  kind: "activity" | "flight";
  title: string;
  price: number;
  paid_by: "pesciolino" | "talpina";
  sortKey: string;
}

export default function ExpensesTab({ activities, flights = [] }: Props) {
  const activityExpenses: Expense[] = activities
    .filter((a) => a.price != null && a.price > 0 && a.paid_by != null)
    .map((a) => ({
      id: `a-${a.id}`,
      kind: "activity",
      title: a.title,
      price: a.price!,
      paid_by: a.paid_by!,
      sortKey: `${String(a.day_number ?? 999).padStart(4, "0")}-${a.created_at}`,
    }));

  const flightExpenses: Expense[] = flights
    .filter((f) => f.price != null && f.price > 0 && f.paid_by != null)
    .map((f) => ({
      id: `f-${f.id}`,
      kind: "flight",
      title: `✈️ ${f.airline || "Volo"}${
        f.flight_number ? ` · ${f.flight_number}` : ""
      }`,
      price: f.price!,
      paid_by: f.paid_by!,
      sortKey: `0000-${f.departure_at || f.created_at}`,
    }));

  const expenses = [...activityExpenses, ...flightExpenses].sort((a, b) =>
    a.sortKey.localeCompare(b.sortKey),
  );

  const totalPesciolino = expenses
    .filter((e) => e.paid_by === "pesciolino")
    .reduce((sum, e) => sum + e.price, 0);
  const totalTalpina = expenses
    .filter((e) => e.paid_by === "talpina")
    .reduce((sum, e) => sum + e.price, 0);
  const total = totalPesciolino + totalTalpina;
  const net = (totalPesciolino - totalTalpina) / 2;

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-3">💰</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
          Nessuna spesa registrata. Aggiungi un prezzo e seleziona chi ha pagato
          in un&apos;attività o volo.
        </p>
      </div>
    );
  }

  return (
    <div>
      {net === 0 && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
          <p className="text-sm font-semibold text-green-700 dark:text-green-400 flex items-center gap-2">
            <span>✨</span> Siete in pari
          </p>
          <p className="text-xs text-green-600 dark:text-green-400/80 mt-1">
            Totale: €{total.toFixed(2)} · Pesciolino: €{totalPesciolino.toFixed(2)} · Talpina: €{totalTalpina.toFixed(2)}
          </p>
        </div>
      )}

      {net > 0 && (
        <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-2">
            <span>💸</span>
            {PAYER_ICONS.talpina} {PAYER_LABELS.talpina} deve a {PAYER_ICONS.pesciolino} {PAYER_LABELS.pesciolino} €{net.toFixed(2)}
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-400/80 mt-1">
            Totale: €{total.toFixed(2)} · Pesciolino: €{totalPesciolino.toFixed(2)} · Talpina: €{totalTalpina.toFixed(2)}
          </p>
        </div>
      )}

      {net < 0 && (
        <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-2">
            <span>💸</span>
            {PAYER_ICONS.pesciolino} {PAYER_LABELS.pesciolino} deve a {PAYER_ICONS.talpina} {PAYER_LABELS.talpina} €{(-net).toFixed(2)}
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-400/80 mt-1">
            Totale: €{total.toFixed(2)} · Pesciolino: €{totalPesciolino.toFixed(2)} · Talpina: €{totalTalpina.toFixed(2)}
          </p>
        </div>
      )}

      <div className="space-y-1">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="flex items-start gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 dark:text-white break-words">
                {expense.title}
              </p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                  {PAYER_ICONS[expense.paid_by]} {PAYER_LABELS[expense.paid_by]}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  €{(expense.price / 2).toFixed(2)} a testa
                </span>
              </div>
            </div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white shrink-0">
              €{expense.price.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
