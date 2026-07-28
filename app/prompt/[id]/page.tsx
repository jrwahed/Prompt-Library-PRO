import { notFound } from "next/navigation";
import { BackButton } from "@/components/BackButton";
import { PromptWorkspace } from "@/components/prompt/PromptWorkspace";
import { getAllPrompts, getPrompt, getSection } from "@/lib/library";

export function generateStaticParams() {
  return getAllPrompts().map((prompt) => ({ id: prompt.id }));
}

export default async function PromptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prompt = getPrompt(id);
  if (!prompt) notFound();

  const section = getSection(prompt.sectionId);
  const aiEnabled = Boolean(process.env.AI_API_KEY);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-10">
      <BackButton
        href={section ? `/section/${section.id}` : "/"}
        label={section ? `رجوع لـ ${section.name}` : "رجوع"}
      />
      <PromptWorkspace prompt={prompt} aiEnabled={aiEnabled} />
    </main>
  );
}
