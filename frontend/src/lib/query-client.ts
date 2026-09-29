import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "@/lib/http";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        // Client errors (401, 404, ...) won't change on retry; only retry server hiccups.
        retry: (failureCount, error) =>
          !(error instanceof ApiError && error.status < 500) && failureCount < 2,
      },
    },
  });
}
