"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const next = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
  const icon = theme === "light" ? "☀️" : theme === "dark" ? "🌙" : "💻";

  return (
    <button
      onClick={() => setTheme(next)}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
      title={`Tema: ${theme === "light" ? "Chiaro" : theme === "dark" ? "Scuro" : "Sistema"}`}
    >
      {icon}
    </button>
  );
}
