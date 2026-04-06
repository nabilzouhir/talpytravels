import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import BottomNav from "@/components/BottomNav";
import LogoutButton from "@/components/LogoutButton";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-gray-900 dark:text-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="TalpyTravels" width={32} height={32} className="rounded-full" />
            TalpyTravels
          </Link>
          <div className="flex items-center gap-1">
            <Link
              href="/destinations/new"
              className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors"
            >
              + Nuova
            </Link>
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-6 pb-20 md:pb-6">
        {children}
      </main>

      {/* Bottom nav (mobile only) */}
      <BottomNav />
    </div>
  );
}
