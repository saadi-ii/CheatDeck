import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CheatsheetSummary } from "../types";

export function CheatsheetCard({ item }: { item: CheatsheetSummary }) {
  return (
    <Link href={`/${item.slug}`} className="group block">
      <Card className="h-full transition-colors group-hover:bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {item.icon && <span aria-hidden>{item.icon}</span>}
            <span>{item.title}</span>
            {item.version && <Badge variant="secondary">{item.version}</Badge>}
          </CardTitle>
          {item.description && <CardDescription>{item.description}</CardDescription>}
        </CardHeader>
      </Card>
    </Link>
  );
}
