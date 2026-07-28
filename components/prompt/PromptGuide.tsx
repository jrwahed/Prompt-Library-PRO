import { Lightbulb, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { PromptEntry } from "@/lib/types";

/**
 * The plain-Arabic briefing an employee reads before touching the form:
 * what this prompt produces, how to run it, and how to get a good result.
 * Renders nothing when the markdown source has no explainer yet.
 */
export function PromptGuide({ prompt }: { prompt: PromptEntry }) {
  // Fall back to empty lists: a library.json generated before these fields
  // existed omits them entirely.
  const howToUse = prompt.howToUse ?? [];
  const tips = prompt.tips ?? [];

  if (!prompt.whatItDoes && howToUse.length === 0 && tips.length === 0) return null;

  return (
    <Card className="border-brand-200 bg-brand-50/60 dark:border-brand-800 dark:bg-brand-900/30">
      <CardContent className="flex flex-col gap-6 p-6">
        {prompt.whatItDoes && (
          <div className="flex flex-col gap-1.5">
            <h2 className="flex items-center gap-2 text-sm font-bold text-brand-700 dark:text-brand-200">
              <Sparkles className="h-4 w-4" />
              بيعمل إيه؟
            </h2>
            <p className="text-base leading-relaxed text-content">{prompt.whatItDoes}</p>
          </div>
        )}

        {howToUse.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-bold text-brand-700 dark:text-brand-200">
              إزاي تستخدمه؟
            </h2>
            <ol className="flex flex-col gap-2.5">
              {howToUse.map((step, i) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 font-latin text-[11px] font-bold text-white dark:bg-brand-500">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-content">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {tips.length > 0 && (
          <div className="flex flex-col gap-2.5">
            <h2 className="flex items-center gap-2 text-sm font-bold text-brand-700 dark:text-brand-200">
              <Lightbulb className="h-4 w-4" />
              عشان تطلع بأحسن نتيجة
            </h2>
            <ul className="flex flex-col gap-2">
              {tips.map((tip) => (
                <li key={tip} className="flex items-start gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                  <span className="text-sm leading-relaxed text-content-muted">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
