"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeProviderContext = createContext({});

export function ThemeProvider({
  children,
  defaultTheme = "dark", // Changed default to dark
  storageKey = "theme",
  ...props
}) {
  const [theme] = useState("dark"); // Always use dark theme

  // Force dark theme on component mount
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove any theme classes and add dark
    root.classList.remove("light", "system");
    root.classList.add("dark");
    
    // Save dark theme to localStorage
    localStorage.setItem(storageKey, "dark");
  }, [storageKey]);

  // Keep context for backwards compatibility with components that use it
  const value = {
    theme: "dark",
    // Provide no-op function for setTheme to avoid errors in components that call it
    setTheme: () => {},
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  
  return context;
};