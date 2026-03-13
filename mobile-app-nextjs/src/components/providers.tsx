"use client";

import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth-context";
import { PwaInstallPrompt } from "@/components/pwa-install-prompt";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools"; // Commented out for production
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes - longer for mobile performance
            gcTime: 30 * 60 * 1000, // 30 minutes - longer cache lifetime
            refetchOnWindowFocus: false,
            refetchOnReconnect: true, // Important for mobile connectivity
            retry: (failureCount: number, error: Error) => {
              // Don't retry on network errors, but retry on other errors up to 2 times
              if (error.message.includes('Network request failed')) {
                return false;
              }
              return failureCount < 2;
            },
            retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
            networkMode: 'always', // Important for mobile offline scenarios
          },
          mutations: {
            onError: (error: Error) => {
              console.error('Mutation error:', error);
            },
            retry: 1, // Retry mutations once
            retryDelay: 1000, // 1 second delay for mutation retries
          },
        },
      })
  );

  // Register service worker for PWA install prompt
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // SW registration failed — non-critical
      });
    }
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <PwaInstallPrompt />
          {children}
          <Toaster />
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}