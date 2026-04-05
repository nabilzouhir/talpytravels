"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const isHome = pathname === "/";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-[env(safe-area-inset-bottom)] z-50 md:hidden">
      <div className="flex justify-around items-center h-14">
        <Link
          href="/"
          className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs ${
            isHome
              ? "text-accent-600 dark:text-accent-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1"
            />
          </svg>
          <span>Viaggi</span>
        </Link>
        <Link
          href="/destinations/new"
          className="flex flex-col items-center gap-0.5 px-3 py-1 text-xs text-gray-500 dark:text-gray-400"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Nuova</span>
        </Link>
      </div>
    </nav>
  );
}
