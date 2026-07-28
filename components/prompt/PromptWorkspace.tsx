"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="w-fit rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            {prompt.code}
          </span>
          <h1 className="text-2xl font-bold sm:text-3xl">{prompt.title}</h1>
          {prompt.whenToUse && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              متى تستخدمه: {prompt.whenToUse}
            </p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleFavoriteToggle}
          className="gap-1.5"
        >
          <Heart className={favorite ? "h-4 w-4 fill-rose-500 text-rose-500" : "h-4 w-4"} />
          {favorite ? "في المفضلة" : "أضف للمفضلة"}
        </Button>
      </div>

      <div dir="ltr" className="grid gap-6 md:grid-cols-2">
        <div dir="rtl">
          <Card>
            <CardHeader>
              <CardTitle>1. املأ الفراغات</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {prompt.variables.length === 0 ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  البرومبت ده مفهوش متغيرات — جاهز للنسخ زي ما هو.
                </p>
              ) : (
                prompt.variables.map((variable) => (
                  <label key={variable} className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {variable}
                    </span>
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
        </div>

        <div dir="rtl">
          <Card className="flex h-full flex-col">
            <CardHeader>
              <CardTitle>2. المعاينة الحية</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4">
              <pre className="max-h-[28rem] flex-1 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-zinc-50 p-4 text-sm leading-relaxed dark:bg-zinc-900">
                {finalPrompt}
              </pre>
              <Button size="lg" onClick={handleCopy} className="gap-2">
                {feedback ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {feedback ?? "انسخ البرومبت"}
              </Button>
              {copyCount > 0 && (
                <p className="text-center text-xs text-zinc-400">
                  اتنسخ {copyCount} مرة على الجهاز ده
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {prompt.chatCommands.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
            💬 أوامر الشات (اضغط عشان تنسخ البرومبت + الأمر)
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
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4" />
              حسّن بالـ AI (اختياري)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAiEnhance}
              disabled={aiLoading}
              className="w-fit gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {aiLoading ? "بيحسّن…" : "حسّن البرومبت ده بالـ AI"}
            </Button>
            {aiError && <p className="text-sm text-rose-500">{aiError}</p>}
            {aiResult && (
              <pre className="max-h-[28rem] overflow-auto whitespace-pre-wrap break-words rounded-lg bg-zinc-50 p-4 text-sm leading-relaxed dark:bg-zinc-900">
                {aiResult}
              </pre>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
