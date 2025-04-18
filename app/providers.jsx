// app/providers.jsx
'use client';

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./providers/theme-provider";

export function NextAuthProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}

export function Providers({ children }) {
  return (
    <ThemeProvider defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      <NextAuthProvider>{children}</NextAuthProvider>
    </ThemeProvider>
  );
}