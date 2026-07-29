"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import type { PromptEntry, PromptSection } from "@/lib/types";

export function SearchBar({
  prompts,
  sections,
}: {
  prompts: PromptEntry[];
  sections: PromptSection[];
}) {
  const [query, setQuery] = useState("");
  const sectionById = useMemo(
    () => new Map(sections.map((s) => [s.id, s])),
    [sections]
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return prompts
      .filter((p) => {
        const haystack = [p.code, p.title, p.whenToUse ?? ""].join(" ").toLowerCase();
        return haystack.includes(q);
      })
      .slice(0, 12);
  }, [prompts, query]);

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-content-subtle" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="دوّر في كل البرومبتات…"
          className="h-12 pe-11 ps-11 text-base"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            aria-label="مسح البحث"
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-content-subtle transition-colors hover:text-content"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {query.trim() && (
        <Card className="absolute z-30 mt-2 max-h-96 w-full overflow-y-auto p-2 text-start shadow-pop">
          {results.length === 0 ? (
            <p className="p-4 text-center text-sm text-content-muted">
              مفيش نتائج لـ «{query}»
            </p>
          ) : (
            <ul className="flex flex-col gap-1">
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/prompt/${p.id}`}
                    className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-brand-50 dark:hover:bg-brand-900/50"
                  >
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate text-sm font-semibold text-content">
                        {p.title}
                      </span>
                      {p.whenToUse && (
                        <span className="line-clamp-1 text-xs text-content-muted">
                          {p.whenToUse}
                        </span>
                      )}
                    </span>
                    <span className="flex shrink-0 items-center gap-2 text-xs text-content-subtle">
                      <span>{sectionById.get(p.sectionId)?.emoji}</span>
                      <span className="rounded-md bg-surface-sunken px-1.5 py-0.5 font-latin font-semibold">
                        {p.code}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}
    </div>
  );
}
