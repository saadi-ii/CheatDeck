import { z } from "zod";

/** Mirrors RESERVED_SLUGS in backend/src/validation/cheatsheet.schema.ts. */
export const RESERVED_SLUGS = ["admin", "api", "new", "login"];

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes")
  .refine((slug) => !RESERVED_SLUGS.includes(slug), "This slug is reserved");
