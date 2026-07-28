"use client";

import { useEffect, useState } from "react";
import { PromptCard } from "@/components/PromptCard";
import { getFavorites, getRecent } from "@/lib/storage";
import type { PromptEntry } from "@/lib/types";

export function QuickAccessRows({ prompts }: { prompts: PromptEntry[] }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    setFavoriteIds(getFavorites());
    setRecentIds(getRecent());
  }, []);

  const byId = new Map(prompts.map((p) => [p.id, p]));
  const favorites = favoriteIds.map((id) => byId.get(id)).filter(Boolean) as PromptEntry[];
  const recent = recentIds.map((id) => byId.get(id)).filter(Boolean) as PromptEntry[];

  if (favorites.length === 0 && recent.length === 0) return null;

  return (
    <div className="flex w-full max-w-6xl flex-col gap-8">
      {favorites.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">⭐ المفضلة</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((p) => (
              <PromptCard key={p.id} prompt={p} />
            ))}
          </div>
        </section>
      )}
      {recent.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">🕘 آخر المستخدمة</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((p) => (
              <PromptCard key={p.id} prompt={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
