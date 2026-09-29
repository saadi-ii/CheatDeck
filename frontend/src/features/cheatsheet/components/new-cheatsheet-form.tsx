"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateCheatsheet } from "../hooks/use-cheatsheets";
import { slugify, slugSchema } from "../lib/slug";

const newSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  slug: slugSchema,
});

export function NewCheatsheetForm() {
  const router = useRouter();
  const create = useCreateCheatsheet();
  // Follow the title until the slug is edited by hand.
  const [slugEdited, setSlugEdited] = useState(false);

  const form = useForm({
    defaultValues: { title: "", slug: "" },
    validators: { onSubmit: newSchema },
    onSubmit: ({ value }) =>
      create.mutate(
        { ...value, icon: "", description: "", version: "", published: false, sections: [] },
        { onSuccess: () => router.push(`/admin/${value.slug}`) },
      ),
  });

  return (
    <form
      className="max-w-md space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.Field name="title">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Title</Label>
            <Input
              id={field.name}
              placeholder="Next.js"
              autoFocus
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => {
                field.handleChange(event.target.value);
                if (!slugEdited) form.setFieldValue("slug", slugify(event.target.value));
              }}
            />
            {field.state.meta.errors.map((error, index) => (
              <p key={index} className="text-sm text-destructive">
                {error?.message}
              </p>
            ))}
          </div>
        )}
      </form.Field>

      <form.Field name="slug">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Slug</Label>
            <Input
              id={field.name}
              placeholder="nextjs"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => {
                setSlugEdited(true);
                field.handleChange(event.target.value);
              }}
            />
            <p className="text-xs text-muted-foreground">The public URL will be /{field.state.value || "slug"}</p>
            {field.state.meta.errors.map((error, index) => (
              <p key={index} className="text-sm text-destructive">
                {error?.message}
              </p>
            ))}
          </div>
        )}
      </form.Field>

      {create.error && <p className="text-sm text-destructive">{create.error.message}</p>}

      <Button type="submit" disabled={create.isPending}>
        {create.isPending ? "Creating..." : "Create draft"}
      </Button>
    </form>
  );
}
