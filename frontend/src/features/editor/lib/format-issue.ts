import type { ApiIssue } from "@/lib/http";

/** Turns an API validation issue like "sections.0.title" into "Section 1 title: ...". */
export function formatIssue({ path, message }: ApiIssue) {
  const readable = path
    .split(".")
    .map((part, index, parts) => {
      if (/^\d+$/.test(part)) return null; // index is folded into the previous word below
      const next = parts[index + 1];
      const number = next !== undefined && /^\d+$/.test(next) ? ` ${Number(next) + 1}` : "";
      const word = part === "sections" ? "Section" : part === "blocks" ? "block" : part;
      return `${word}${number}`;
    })
    .filter(Boolean)
    .join(" ");

  return readable ? `${readable}: ${message}` : message;
}
