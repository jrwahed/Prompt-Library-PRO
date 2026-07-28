import rawLibrary from "@/content/library.json";
import type { PromptEntry, PromptLibrary, PromptSection } from "@/lib/types";

const library = rawLibrary as PromptLibrary;

export function getSections(): PromptSection[] {
  return [...library.sections].sort((a, b) => a.number - b.number);
}

export function getSection(sectionId: string): PromptSection | undefined {
  return library.sections.find((s) => s.id === sectionId);
}

export function getAllPrompts(): PromptEntry[] {
  return library.prompts;
}

export function getPromptsBySection(sectionId: string): PromptEntry[] {
  return library.prompts.filter((p) => p.sectionId === sectionId);
}

export function getPrompt(promptId: string): PromptEntry | undefined {
  return library.prompts.find((p) => p.id === promptId);
}

export function getPromptCountForSection(sectionId: string): number {
  return library.prompts.filter((p) => p.sectionId === sectionId).length;
}

export function searchPrompts(query: string): PromptEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return library.prompts.filter((p) => {
    const haystack = [p.code, p.title, p.whenToUse ?? ""].join(" ").toLowerCase();
    return haystack.includes(q);
  });
}

export function fillTemplate(template: string, values: Record<string, string>): string {
  let result = template;
  for (const [name, value] of Object.entries(values)) {
    if (!value) continue;
    const pattern = new RegExp(`\\[${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\]`, "g");
    result = result.replace(pattern, value);
  }
  return result;
}
