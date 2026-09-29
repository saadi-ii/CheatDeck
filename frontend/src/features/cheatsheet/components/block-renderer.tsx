import type { Block, BlockType } from "../types";
import { CodeBlock } from "./code-block";
import { TextBlock } from "./text-block";
import { VersionBadges } from "./version-badges";

// Adding a block type = one component + one entry here.
const renderers: Record<BlockType, (props: { block: Block }) => React.ReactNode | Promise<React.ReactNode>> = {
  text: TextBlock,
  code: CodeBlock,
};

export function BlockRenderer({ block }: { block: Block }) {
  const Renderer = renderers[block.type];
  if (!Renderer) return null;

  return (
    <>
      <VersionBadges block={block} />
      <Renderer block={block} />
    </>
  );
}
