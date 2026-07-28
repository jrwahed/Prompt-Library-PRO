// Optional AI enhancement — completely isolated from the core template engine.
// The app works 100% without this file being called; it only runs if AI_API_KEY is set.
// Swap providers with a single env var: AI_PROVIDER=gemini (default) | groq

const SYSTEM_INSTRUCTION =
  "أنت مساعد بيحسّن ويخصّص البرومبتات دي بناءً على السياق، من غير ما يغيّر الهدف الأساسي منها. رد بالبرومبت المحسّن بس.";

async function enhanceWithGemini(prompt: string, apiKey: string): Promise<string> {
  const model = process.env.AI_MODEL || "gemini-2.0-flash";
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`Gemini API error: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini لم يرجّع نتيجة.");
  return text;
}

async function enhanceWithGroq(prompt: string, apiKey: string): Promise<string> {
  const model = process.env.AI_MODEL || "llama-3.3-70b-versatile";
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_INSTRUCTION },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`Groq API error: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error("Groq لم يرجّع نتيجة.");
  return text;
}

export async function enhancePrompt(prompt: string): Promise<string> {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    throw new Error("AI_API_KEY مش متظبط. زرار الـ AI المفروض يكون مخفي أصلاً.");
  }

  const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();
  if (provider === "groq") return enhanceWithGroq(prompt, apiKey);
  return enhanceWithGemini(prompt, apiKey);
}
