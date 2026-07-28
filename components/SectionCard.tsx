import Link from "next/link";
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
    <Link href={`/section/${section.id}`}>
      <Card className="group h-full transition-colors hover:border-zinc-400 dark:hover:border-zinc-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <span className="text-3xl">{section.emoji}</span>
            <Badge variant="secondary">{count} برومبت</Badge>
          </div>
          <CardTitle className="pt-2 leading-relaxed">
            القسم {section.number} — {section.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <span className="text-sm text-zinc-500 group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-zinc-50">
            افتح القسم ←
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
