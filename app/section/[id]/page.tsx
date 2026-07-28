import { notFound } from "next/navigation";
import { BackButton } from "@/components/BackButton";
import { PromptCard } from "@/components/PromptCard";
import { getPromptsBySection, getSection, getSections } from "@/lib/library";

export function generateStaticParams() {
  return getSections().map((section) => ({ id: section.id }));
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const section = getSection(id);
  if (!section) notFound();

  const prompts = getPromptsBySection(section.id);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10">
      <BackButton href="/" label="رجوع للأقسام" />

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{section.emoji}</span>
          <h1 className="text-2xl font-bold sm:text-3xl">
            القسم {section.number} — {section.name}
          </h1>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {prompts.length} برومبت جاهز في القسم ده
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {prompts.map((prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} />
        ))}
      </div>
    </main>
  );
}
