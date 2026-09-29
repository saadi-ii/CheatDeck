import type { Section } from "../types";

export function SectionNav({ sections }: { sections: Section[] }) {
  if (sections.length === 0) return null;

  return (
    <nav aria-label="Sections" className="lg:sticky lg:top-20">
      <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">On this page</p>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 lg:flex-col lg:gap-1">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {section.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
