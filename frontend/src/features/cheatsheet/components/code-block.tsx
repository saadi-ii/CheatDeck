import { bundledLanguages, codeToHtml } from "shiki";
import type { Block } from "../types";
import { CopyButton } from "./copy-button";

// Highlighted on the server: no highlighter code is shipped to the browser.
export async function CodeBlock({ block }: { block: Block }) {
  const lang = block.language && block.language in bundledLanguages ? block.language : "text";

  const html = await codeToHtml(block.content, {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });

  return (
    <div className="my-4 overflow-hidden rounded-lg border bg-muted/40">
      <div className="flex items-center justify-between border-b py-1 pr-1 pl-3 text-xs text-muted-foreground">
        <span>{block.language || "text"}</span>
        <CopyButton text={block.content} />
      </div>
      <div className="code-block overflow-x-auto p-4 text-sm" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
