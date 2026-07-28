"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fillTemplate } from "@/lib/library";
import {
  addRecent,
  getCopyCount,
  incrementCopyCount,
  isFavorite,
  toggleFavorite,
} from "@/lib/storage";
import type { PromptEntry } from "@/lib/types";

export function PromptWorkspace({
  prompt,
  aiEnabled,
}: {
  prompt: PromptEntry;
  aiEnabled: boolean;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [favorite, setFavorite] = useState(false);
  const [copyCount, setCopyCount] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    addRecent(prompt.id);
    setFavorite(isFavorite(prompt.id));
    setCopyCount(getCopyCount(prompt.id));
  }, [prompt.id]);

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 1800);
    return () => clearTimeout(timer);
  }, [feedback]);

  const finalPrompt = useMemo(
    () => fillTemplate(prompt.template, values),
    [prompt.template, values]
  );

  const filledCount = prompt.variables.filter((v) => (values[v] ?? "").trim()).length;

  const handleValueChange = (variable: string, value: string) => {
    setValues((prev) => ({ ...prev, [variable]: value }));
  };

  const copyToClipboard = async (text: string, message: string) => {
    await navigator.clipboard.writeText(text);
    setCopyCount(incrementCopyCount(prompt.id));
    setFeedback(message);
  };

  const handleCopy = () => copyToClipboard(finalPrompt, "✅ اتنسخ البرومبت");

  const handleChipClick = (command: string) =>
    copyToClipboard(`${finalPrompt}\n\n${command}`, "✅ اتنسخ البرومبت + الأمر");

  const handleFavoriteToggle = () => setFavorite(toggleFavorite(prompt.id));

  const handleAiEnhance = async () => {
    setAiLoading(true);
    setAiError(null);
    setAiResult(null);
    try {
      const res = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: finalPrompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "حصل خطأ غير متوقع");
      setAiResult(data.result);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "حصل خطأ غير متوقع");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-hairline pb-8">
        <div className="flex flex-col items-start gap-2.5">
          <Badge variant="secondary" className="font-latin tracking-wide">
            {prompt.code}
          </Badge>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            {prompt.title}
          </h1>
          {prompt.whenToUse && (
            <p className="max-w-2xl text-sm leading-relaxed text-content-muted">
              {prompt.whenToUse}
            </p>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={handleFavoriteToggle}>
          <Heart className={favorite ? "fill-brand-500 text-brand-500" : ""} />
          {favorite ? "في المفضلة" : "أضف للمفضلة"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-900 font-latin text-xs font-bold text-white dark:bg-brand-500">
                  1
                </span>
                املأ الفراغات
              </CardTitle>
              {prompt.variables.length > 0 && (
                <span className="font-latin text-xs font-semibold text-content-subtle">
                  {filledCount}/{prompt.variables.length}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {prompt.variables.length === 0 ? (
              <p className="text-sm text-content-muted">
                البرومبت ده مفهوش متغيرات — جاهز للنسخ زي ما هو.
              </p>
            ) : (
              prompt.variables.map((variable) => (
                <label key={variable} className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold text-content">{variable}</span>
                  <Input
                    placeholder={variable}
                    value={values[variable] ?? ""}
                    onChange={(e) => handleValueChange(variable, e.target.value)}
                  />
                </label>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="flex h-full flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-900 font-latin text-xs font-bold text-white dark:bg-brand-500">
                2
              </span>
              المعاينة الحية
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4">
            <pre
              dir="auto"
              className="max-h-[28rem] flex-1 overflow-auto whitespace-pre-wrap break-words rounded-xl border border-hairline bg-surface-sunken p-4 text-sm leading-relaxed text-content"
            >
              {finalPrompt}
            </pre>
            <Button size="lg" onClick={handleCopy}>
              {feedback ? <Check /> : <Copy />}
              {feedback ?? "انسخ البرومبت"}
            </Button>
            {copyCount > 0 && (
              <p className="text-center text-xs text-content-subtle">
                اتنسخ {copyCount} مرة على الجهاز ده
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {prompt.chatCommands.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-bold text-content">
            💬 أوامر الشات{" "}
            <span className="font-medium text-content-subtle">
              (اضغط عشان تنسخ البرومبت + الأمر)
            </span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {prompt.chatCommands.map((command) => (
              <Button
                key={command}
                variant="chip"
                size="sm"
                onClick={() => handleChipClick(command)}
                className="rounded-full"
              >
                {command}
              </Button>
            ))}
          </div>
        </div>
      )}

      {aiEnabled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-500" />
              حسّن بالـ AI (اختياري)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAiEnhance}
              disabled={aiLoading}
              className="w-fit"
            >
              <Sparkles />
              {aiLoading ? "بيحسّن…" : "حسّن البرومبت ده بالـ AI"}
            </Button>
            {aiError && <p className="text-sm text-rose-500">{aiError}</p>}
            {aiResult && (
              <pre
                dir="auto"
                className="max-h-[28rem] overflow-auto whitespace-pre-wrap break-words rounded-xl border border-hairline bg-surface-sunken p-4 text-sm leading-relaxed"
              >
                {aiResult}
              </pre>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
