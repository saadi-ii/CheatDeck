import { z } from "zod";
import { BLOCK_TYPES } from "../model/cheatsheet.model.js";

// Empty strings mean "not set", so they are dropped instead of stored.
const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || undefined);

const blockSchema = z.object({
  id: z.string().min(1).optional(),
  type: z.enum(BLOCK_TYPES),
  content: z.string().default(""),
  language: z.string().optional(),
  runnable: z.boolean().default(false),
  since: optionalText,
  deprecated: optionalText,
});

const sectionSchema = z.object({
  id: z.string().min(1).optional(),
  title: z.string().trim().min(1),
  blocks: z.array(blockSchema).default([]),
});

// Slugs that would collide with app routes (/admin, /api, /admin/new, /admin/login).
const RESERVED_SLUGS = ["admin", "api", "new", "login"];

export const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and dashes")
  .refine((slug) => !RESERVED_SLUGS.includes(slug), "This slug is reserved");

/** Body for both create (POST) and full save (PUT). */
export const cheatsheetBodySchema = z.object({
  slug: slugSchema,
  title: z.string().trim().min(1),
  icon: z.string().default(""),
  description: z.string().default(""),
  version: z.string().default(""),
  published: z.boolean().default(false),
  sections: z.array(sectionSchema).default([]),
});

export type CheatsheetBody = z.infer<typeof cheatsheetBodySchema>;
