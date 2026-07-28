import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackButton } from "@/components/BackButton";
import { PromptCard } from "@/components/PromptCard";
import { getPromptsBySection, getSection, getSections } from "@/lib/library";

export function generateStaticParams() {
  return getSections().map((section) => ({ id: section.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const section = getSection(id);
  return { title: section?.name ?? "قسم" };
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

      <div className="flex flex-col gap-4 border-b border-hairline pb-8">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-3xl dark:bg-brand-900/60">
            {section.emoji}
          </span>
          <div className="flex flex-col gap-1">
            <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-content-subtle">
              Section {section.number}
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              {section.name}
            </h1>
          </div>
        </div>
        <p className="text-sm text-content-muted">
          {prompts.length} برومبت جاهز في القسم ده.
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
