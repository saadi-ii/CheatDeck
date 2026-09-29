"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptSuggestion, adminSuggestions, rejectSuggestion, setUserBanned } from "../api";

export const pendingKey = ["suggestions", "pending"] as const;

export function usePendingSuggestions() {
  return useQuery({ queryKey: pendingKey, queryFn: () => adminSuggestions("pending") });
}

interface ReviewArgs {
  id: string;
  action: "accept" | "reject";
  note?: string;
}

export function useReviewSuggestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, action, note }: ReviewArgs) =>
      action === "accept" ? acceptSuggestion(id, note) : rejectSuggestion(id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pendingKey });
      // An accepted suggestion changes a cheatsheet, so lists and open editors must refetch.
      queryClient.invalidateQueries({ queryKey: ["cheatsheets"] });
      queryClient.invalidateQueries({ queryKey: ["cheatsheet"] });
    },
  });
}

export function useBanMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, banned }: { userId: string; banned: boolean }) => setUserBanned(userId, banned),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: pendingKey }),
  });
}
