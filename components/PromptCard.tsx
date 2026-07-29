"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { getCopyCount, isFavorite } from "@/lib/storage";
import type { PromptEntry } from "@/lib/types";

export function PromptCard({ prompt }: { prompt: PromptEntry }) {
  const [favorite, setFavorite] = useState(false);
  const [copyCount, setCopyCount] = useState(0);

  useEffect(() => {
    setFavorite(isFavorite(prompt.id));
    setCopyCount(getCopyCount(prompt.id));
  }, [prompt.id]);

  return (
    <Link
      href={`/prompt/${prompt.id}`}
      className="group flex h-full flex-col gap-2 rounded-card border border-hairline bg-surface-raised p-5 transition-colors hover:border-hairline-strong hover:bg-surface-sunken"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-latin text-xs font-semibold tracking-wide text-brand-600 dark:text-brand-300">
          {prompt.code}
        </span>
        <span className="flex items-center gap-2 font-latin text-xs text-content-subtle">
          {copyCount > 0 && <span title="عدد مرات النسخ">{copyCount}×</span>}
          {favorite && <Heart className="h-3.5 w-3.5 fill-brand-500 text-brand-500" />}
        </span>
      </div>

      <h3 className="font-semibold leading-snug text-content">{prompt.title}</h3>

      {prompt.whenToUse && (
        <p className="line-clamp-2 text-sm leading-relaxed text-content-muted">
          {prompt.whenToUse}
        </p>
      )}

      {prompt.variables.length > 0 && (
        <p className="mt-auto pt-2 font-latin text-xs text-content-subtle">
          {prompt.variables.length} حقل تملأه
        </p>
      )}
    </Link>
  );
}
