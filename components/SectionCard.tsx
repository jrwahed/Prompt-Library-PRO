import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PromptSection } from "@/lib/types";

export function SectionCard({
  section,
  count,
}: {
  section: PromptSection;
  count: number;
}) {
  return (
    <Link href={`/section/${section.id}`} className="group block h-full">
      <Card className="flex h-full flex-col transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-brand-400 group-hover:shadow-brand-lg">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-2xl transition-colors group-hover:bg-brand-100 dark:bg-brand-900/60 dark:group-hover:bg-brand-800">
              {section.emoji}
            </span>
            <Badge variant="secondary">{count} برومبت</Badge>
          </div>
          <CardTitle className="pt-3 leading-relaxed">{section.name}</CardTitle>
          <span className="font-display text-xs font-semibold uppercase tracking-wider text-content-subtle">
            Section {section.number}
          </span>
        </CardHeader>
        <CardContent className="mt-auto">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-transform group-hover:-translate-x-0.5 dark:text-brand-300">
            افتح القسم
            <ArrowLeft className="h-4 w-4" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
