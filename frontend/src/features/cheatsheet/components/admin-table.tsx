"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCheatsheets, useDeleteCheatsheet } from "../hooks/use-cheatsheets";
import { STALE_AFTER_DAYS } from "../lib/freshness";

export function AdminTable() {
  const { data, isPending, error } = useCheatsheets();
  const remove = useDeleteCheatsheet();

  if (isPending) return <p className="text-muted-foreground">Loading...</p>;
  if (error) return <p className="text-destructive">{error.message}</p>;

  if (data.length === 0) {
    return (
      <p className="text-muted-foreground">
        No cheatsheets yet.{" "}
        <Link href="/admin/new" className="underline underline-offset-4">
          Create the first one
        </Link>
        .
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Updated</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.slug}>
            <TableCell className="font-medium">
              {item.icon} {item.title}
            </TableCell>
            <TableCell className="text-muted-foreground">{item.slug}</TableCell>
            <TableCell className="space-x-1">
              <Badge variant={item.published ? "default" : "secondary"}>
                {item.published ? "Published" : "Draft"}
              </Badge>
              {item.stale && (
                <Badge variant="outline" title={`Not updated in over ${STALE_AFTER_DAYS} days. Check it against the latest docs.`}>
                  Stale
                </Badge>
              )}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {new Date(item.updatedAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="space-x-1 text-right">
              <Button variant="outline" size="sm" nativeButton={false} render={<Link href={`/admin/${item.slug}`} />}>
                Edit
              </Button>
              {item.published && (
                <Button variant="ghost" size="sm" nativeButton={false} render={<Link href={`/${item.slug}`} />}>
                  View
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive"
                disabled={remove.isPending}
                onClick={() => {
                  if (window.confirm(`Delete "${item.title}"? This cannot be undone.`)) remove.mutate(item.slug);
                }}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
