import React from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

const OPTIONS = [
  { id: "light", icon: Sun, label: "Claro" },
  { id: "dark", icon: Moon, label: "Escuro" },
  { id: "system", icon: Monitor, label: "Sistema" },
];

export default function ThemeToggle({ variant = "pill", className = "" }) {
  const { theme, setTheme } = useTheme();

  if (variant === "row") {
    return (
      <div className={`flex items-center gap-1 bg-gray-100 rounded-full p-1 ${className}`}>
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const active = theme === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setTheme(opt.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-full text-xs font-medium transition-colors ${
                active ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {opt.label}
            </button>
          );
        })}
      </div>
    );
  }

  // pill variant (compact, icon-only)
  return (
    <div className={`flex items-center gap-1 bg-gray-100 rounded-full p-1 ${className}`}>
      {OPTIONS.map((opt) => {
        const Icon = opt.icon;
        const active = theme === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => setTheme(opt.id)}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
              active ? "bg-violet-600 text-white" : "text-gray-500 hover:text-gray-700 hover:bg-white"
            }`}
            aria-label={opt.label}
          >
            <Icon className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
}