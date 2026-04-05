"use client";

import { useSearchParams } from "next/navigation";

export default function LoginForm({
  action,
}: {
  action: (formData: FormData) => Promise<void>;
}) {
  const searchParams = useSearchParams();
  const hasError = searchParams.get("error") === "1";

  return (
    <form
      action={action}
      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm"
    >
      <label
        htmlFor="password"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        autoFocus
        placeholder="Inserisci la password"
        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
      />
      {hasError && (
        <p className="text-sm text-red-500 mt-2">Password non corretta</p>
      )}
      <button
        type="submit"
        className="w-full mt-4 px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white font-medium rounded-lg transition-colors"
      >
        Accedi
      </button>
    </form>
  );
}
