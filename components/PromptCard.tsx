"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Copy, Heart } from "lucide-react";
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
    <Link href={`/prompt/${prompt.id}`} className="group block h-full">
      <Card className="flex h-full flex-col transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-brand-400 group-hover:shadow-brand-lg">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <Badge variant="outline" className="font-latin tracking-wide">
              {prompt.code}
            </Badge>
            <div className="flex items-center gap-2.5 text-content-subtle">
              {copyCount > 0 && (
                <span className="flex items-center gap-1 text-xs" title="عدد مرات النسخ">
                  <Copy className="h-3 w-3" />
                  {copyCount}
                </span>
              )}
              {favorite && <Heart className="h-4 w-4 fill-brand-500 text-brand-500" />}
            </div>
          </div>
          <CardTitle className="pt-1 leading-relaxed transition-colors group-hover:text-brand-600 dark:group-hover:text-brand-300">
            {prompt.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-auto flex flex-col gap-3">
          {prompt.whenToUse && (
            <CardDescription className="line-clamp-2">{prompt.whenToUse}</CardDescription>
          )}
          {prompt.variables.length > 0 && (
            <span className="text-xs font-medium text-content-subtle">
              {prompt.variables.length} حقل تملأه
            </span>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
