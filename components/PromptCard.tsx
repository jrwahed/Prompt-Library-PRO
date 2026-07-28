"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    <Link href={`/prompt/${prompt.id}`}>
      <Card className="group h-full transition-colors hover:border-zinc-400 dark:hover:border-zinc-500">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <Badge variant="outline" className="font-mono">
              {prompt.code}
            </Badge>
            <div className="flex items-center gap-2 text-zinc-400">
              {copyCount > 0 && (
                <span className="text-xs" title="عدد مرات النسخ">
                  نُسخ {copyCount}×
                </span>
              )}
              {favorite && <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />}
            </div>
          </div>
          <CardTitle className="pt-1">{prompt.title}</CardTitle>
        </CardHeader>
        {prompt.whenToUse && (
          <CardContent>
            <CardDescription className="line-clamp-2">
              متى تستخدمه: {prompt.whenToUse}
            </CardDescription>
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
