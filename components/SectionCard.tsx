import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { PromptSection } from "@/lib/types";

/**
 * One row in the section index. Rows sit in a `gap-px` grid over a hairline
 * background, so the dividers between them are shared edges rather than each
 * row carrying its own border.
 */
export function SectionCard({
  section,
  count,
}: {
  section: PromptSection;
  count: number;
}) {
  return (
    <Link
      href={`/section/${section.id}`}
      className="group flex items-center gap-4 bg-surface-raised px-5 py-5 transition-colors hover:bg-surface-sunken"
    >
      <span className="font-latin text-sm font-semibold text-content-subtle transition-colors group-hover:text-brand-500">
        {String(section.number).padStart(2, "0")}
      </span>

      <span className="text-xl leading-none">{section.emoji}</span>

      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold text-content">{section.name}</span>
        <span className="font-latin text-xs text-content-subtle">{count} برومبت</span>
      </span>

      <ArrowLeft className="h-4 w-4 shrink-0 text-content-subtle opacity-0 transition-all group-hover:-translate-x-0.5 group-hover:text-brand-500 group-hover:opacity-100" />
    </Link>
  );
}
