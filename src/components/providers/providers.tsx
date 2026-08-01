"use client";

import { Suspense, type ReactNode } from "react";
import { AuthProvider } from "@/components/auth/auth-provider";
import { AuthModal } from "@/components/auth/auth-modal";
import { ThemeProvider } from "@/components/providers/theme-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
        <Suspense fallback={null}>
          <AuthModal />
        </Suspense>
      </AuthProvider>
    </ThemeProvider>
  );
}
