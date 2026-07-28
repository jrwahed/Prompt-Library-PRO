import { NextResponse } from "next/server";
import { enhancePrompt } from "@/lib/ai-enhance";

export async function POST(request: Request) {
  if (!process.env.AI_API_KEY) {
    return NextResponse.json(
      { error: "ميزة الـ AI متوقفة — مفيش AI_API_KEY متظبط في الـ env." },
      { status: 404 }
    );
  }

  const body = await request.json().catch(() => null);
  const prompt = body?.prompt;
  if (typeof prompt !== "string" || !prompt.trim()) {
    return NextResponse.json({ error: "البرومبت فاضي." }, { status: 400 });
  }

  try {
    const result = await enhancePrompt(prompt);
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "حصل خطأ غير متوقع." },
      { status: 500 }
    );
  }
}
