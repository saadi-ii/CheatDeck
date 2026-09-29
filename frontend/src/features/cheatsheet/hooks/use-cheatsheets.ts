"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminGet, adminList, createCheatsheet, deleteCheatsheet, saveCheatsheet } from "../admin-api";
import type { CheatsheetInput } from "../types";

export const cheatsheetKeys = {
  all: ["cheatsheets"] as const,
  detail: (slug: string) => ["cheatsheet", slug] as const,
};

export function useCheatsheets() {
  return useQuery({ queryKey: cheatsheetKeys.all, queryFn: adminList });
}

/** The editor owns a local draft, so never refetch underneath it. */
export function useCheatsheet(slug: string) {
  return useQuery({
    queryKey: cheatsheetKeys.detail(slug),
    queryFn: () => adminGet(slug),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}

export function useCreateCheatsheet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CheatsheetInput) => createCheatsheet(body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: cheatsheetKeys.all }),
  });
}

/** `slug` is the current saved slug; the body may carry a new one (rename). */
export function useSaveCheatsheet(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CheatsheetInput) => saveCheatsheet(slug, body),
    onSuccess: (saved) => {
      if (saved.slug !== slug) queryClient.removeQueries({ queryKey: cheatsheetKeys.detail(slug) });
      queryClient.setQueryData(cheatsheetKeys.detail(saved.slug), saved);
      queryClient.invalidateQueries({ queryKey: cheatsheetKeys.all });
    },
  });
}

export function useDeleteCheatsheet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => deleteCheatsheet(slug),
    onSuccess: (_data, slug) => {
      queryClient.removeQueries({ queryKey: cheatsheetKeys.detail(slug) });
      queryClient.invalidateQueries({ queryKey: cheatsheetKeys.all });
    },
  });
}
