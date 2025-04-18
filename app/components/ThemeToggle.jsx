"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/app/providers/theme-provider";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after component is mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative flex items-center justify-center rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 focus-visible:ring-offset-2"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      <span className="relative z-10">
        {theme === "dark" ? (
          <Sun className="h-5 w-5 text-yellow-300 transition-transform hover:rotate-45 duration-300" />
        ) : (
          <Moon className="h-5 w-5 text-slate-700 transition-transform hover:-rotate-12 duration-300" />
        )}
      </span>

      {/* Highlight effect */}
      <span
        className={`absolute inset-0 rounded-full transition-opacity ${
          theme === "dark"
            ? "bg-white/10 opacity-0 group-hover:opacity-100"
            : "bg-gray-200 opacity-0 group-hover:opacity-100"
        }`}
      />
    </button>
  );
}