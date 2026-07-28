"use client";

import { useEffect, useState } from "react";
import { PromptCard } from "@/components/PromptCard";
import { getFavorites, getRecent } from "@/lib/storage";
import type { PromptEntry } from "@/lib/types";

function Row({ title, hint, items }: { title: string; hint: string; items: PromptEntry[] }) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-sm text-content-muted">{hint}</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <PromptCard key={p.id} prompt={p} />
        ))}
      </div>
    </section>
  );
}

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
    <div className="flex w-full flex-col gap-12">
      {favorites.length > 0 && (
        <Row
          title="⭐ المفضلة"
          hint="البرومبتات اللي حفظتها على الجهاز ده."
          items={favorites}
        />
      )}
      {recent.length > 0 && (
        <Row title="🕘 آخر المستخدمة" hint="آخر 5 برومبتات فتحتها." items={recent} />
      )}
    </div>
  );
}
