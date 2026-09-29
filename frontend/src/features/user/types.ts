export interface Member {
  id: string;
  name: string;
  avatarUrl: string;
  banned: boolean;
}

export type ProviderName = "github" | "google";
