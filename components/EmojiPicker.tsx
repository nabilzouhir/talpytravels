"use client";

import { useState } from "react";

const TRAVEL_EMOJIS = [
  "🌍", "🌎", "🌏", "✈️", "🏖️", "🏔️", "🏝️", "🗼", "🗽", "🏰",
  "⛩️", "🕌", "🕍", "⛪", "🏛️", "🌋", "🏜️", "🌊", "🌅", "🌄",
  "🎡", "🎢", "🚂", "🚗", "⛵", "🛶", "🧳", "🗺️", "🏕️", "🎪",
  "🍕", "🍣", "🍜", "🥐", "🍷", "🍺", "☕", "🧭", "🔭", "📸",
  "🎭", "🎨", "🎵", "💃", "🤿", "🏄", "⛷️", "🚴", "🧗", "🛕",
  "🌺", "🌸", "🌴", "🍂", "❄️", "☀️", "🌙", "⭐", "🦋", "🐚",
  "🦩", "🐪", "🐘", "🐼", "🦁", "🐬", "🦈", "🐢", "🦜", "🌵",
  "❤️", "💛", "💚", "💙", "💜", "🧡", "🤍", "🖤", "💎", "🔥",
];

interface Props {
  value: string;
  onChange: (emoji: string) => void;
}

export default function EmojiPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Emoji
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-colors"
      >
        <span className="text-3xl">{value || "🌍"}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {open ? "Chiudi" : "Scegli un'emoji"}
        </span>
      </button>
      {open && (
        <div className="mt-2 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
          {TRAVEL_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                onChange(emoji);
                setOpen(false);
              }}
              className={`text-2xl p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                value === emoji
                  ? "bg-accent-50 dark:bg-accent-900/30 ring-2 ring-accent-500"
                  : ""
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
