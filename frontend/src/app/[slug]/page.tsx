import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getCheatsheet } from "@/features/cheatsheet/api";
import { BlockRenderer } from "@/features/cheatsheet/components/block-renderer";
import { SectionNav } from "@/features/cheatsheet/components/section-nav";
import { SuggestButton } from "@/features/suggestion/components/suggest-button";

export const revalidate = 60;

export async function generateMetadata(props: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const cheatsheet = await getCheatsheet(slug).catch(() => null);
  if (!cheatsheet) return { title: "Not found" };
  return { title: cheatsheet.title, description: cheatsheet.description || undefined };
}

const updatedFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" });

export default async function CheatsheetPage(props: PageProps<"/[slug]">) {
  const { slug } = await props.params;
  const cheatsheet = await getCheatsheet(slug);
  if (!cheatsheet) notFound();

  return (
    <div className="grid gap-8 lg:grid-cols-[14rem_1fr]">
      <aside>
        <SectionNav sections={cheatsheet.sections} />
      </aside>

      <article className="min-w-0">
        <header className="mb-8">
          <h1 className="flex items-center gap-3 text-3xl font-semibold tracking-tight">
            {cheatsheet.icon && <span aria-hidden>{cheatsheet.icon}</span>}
            {cheatsheet.title}
            {cheatsheet.version && <Badge variant="secondary">{cheatsheet.version}</Badge>}
          </h1>
          {cheatsheet.description && <p className="mt-2 text-muted-foreground">{cheatsheet.description}</p>}
          <p className="mt-2 text-xs text-muted-foreground">
            Updated {updatedFormat.format(new Date(cheatsheet.updatedAt))}
          </p>
        </header>

        {cheatsheet.sections.length === 0 && <p className="text-muted-foreground">No content yet.</p>}

        {cheatsheet.sections.map((section) => (
          <section key={section.id} id={section.id} className="mb-10 scroll-mt-20">
            <h2 className="mb-4 border-b pb-2 text-xl font-semibold">{section.title}</h2>
            {section.blocks.map((block) => (
              <div key={block.id}>
                <BlockRenderer block={block} />
                <div className="-mt-2 mb-4 flex justify-end">
                  <SuggestButton
                    target={{
                      mode: "edit",
                      cheatsheetSlug: cheatsheet.slug,
                      section: { id: section.id, title: section.title },
                      block: { id: block.id, type: block.type, content: block.content, language: block.language },
                    }}
                  />
                </div>
              </div>
            ))}
            <SuggestButton
              target={{ mode: "add", cheatsheetSlug: cheatsheet.slug, section: { id: section.id, title: section.title } }}
            />
          </section>
        ))}
      </article>
    </div>
  );
}
