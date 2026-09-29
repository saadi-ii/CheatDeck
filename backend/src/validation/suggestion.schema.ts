import { z } from "zod";
import { BLOCK_TYPES } from "../model/cheatsheet.model.js";
import { slugSchema } from "./cheatsheet.schema.js";

export const MAX_CONTENT_LENGTH = 10_000;
export const MAX_NOTE_LENGTH = 500;

// Everything a visitor types is untrusted. We strip control characters and cap sizes here.
// Markdown is never rendered as raw HTML on the site (react-markdown escapes it), so a
// suggestion can't inject markup even after it is accepted.
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

const content = z
  .string()
  .transform((value) => value.replace(CONTROL_CHARS, "").trimEnd())
  .pipe(z.string().min(1, "Content is required").max(MAX_CONTENT_LENGTH, `Content is too long (max ${MAX_CONTENT_LENGTH} characters)`));

const note = z
  .string()
  .transform((value) => value.replace(CONTROL_CHARS, "").trim())
  .pipe(z.string().max(MAX_NOTE_LENGTH, `Note is too long (max ${MAX_NOTE_LENGTH} characters)`))
  .default("");

const language = z
  .string()
  .regex(/^[a-z0-9+#-]{1,20}$/, "Invalid language")
  .optional();

const target = { cheatsheetSlug: slugSchema, sectionId: z.string().min(1), content, language, note };

export const createSuggestionSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("edit"), blockId: z.string().min(1), ...target }),
  z.object({ type: z.literal("add"), blockType: z.enum(BLOCK_TYPES), ...target }),
]);

export type CreateSuggestion = z.infer<typeof createSuggestionSchema>;

export const reviewSchema = z.object({
  note: z
    .string()
    .transform((value) => value.replace(CONTROL_CHARS, "").trim())
    .pipe(z.string().max(MAX_NOTE_LENGTH))
    .default(""),
});
