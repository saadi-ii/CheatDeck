import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Block } from "../types";

// react-markdown does not render raw HTML by default, so content stays safe.
export function TextBlock({ block }: { block: Block }) {
  return (
    <div className="markdown">
      <Markdown remarkPlugins={[remarkGfm]}>{block.content}</Markdown>
    </div>
  );
}
