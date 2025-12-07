"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "../components/ui/tooltip";
import { Toaster } from "../components/ui/toaster";
import { AppProviders } from "../components/providers";
import { useState } from "react";
import { getQueryFn } from "../lib/queryClient"; // Import this helper

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Restore the default query function that fetches from the URL in the queryKey
        queryFn: getQueryFn({ on401: "throw" }),
        // Prevent automatic refetching on window focus to save reads
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AppProviders>
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </AppProviders>
    </QueryClientProvider>
  );
}