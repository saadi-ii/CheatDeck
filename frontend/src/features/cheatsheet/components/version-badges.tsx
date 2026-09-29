import { Badge } from "@/components/ui/badge";
import type { Block } from "../types";

/** "Since X" and "Deprecated in Y" markers shown above a block. Renders nothing when neither is set. */
export function VersionBadges({ block }: { block: Block }) {
  if (!block.since && !block.deprecated) return null;

  return (
    <div className="-mb-2 mt-4 flex flex-wrap gap-2">
      {block.since && <Badge variant="secondary">Since {block.since}</Badge>}
      {block.deprecated && <Badge variant="destructive">Deprecated in {block.deprecated}</Badge>}
    </div>
  );
}
