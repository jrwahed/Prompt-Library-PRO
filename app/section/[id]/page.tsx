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
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6">
      <div className="pt-8">
        <BackButton href="/" label="كل الأقسام" />
      </div>

      <div className="border-b border-hairline py-10">
        <p className="eyebrow">
          Section {String(section.number).padStart(2, "0")}
        </p>
        <h1 className="mt-4 flex items-center gap-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
          <span className="text-2xl leading-none">{section.emoji}</span>
          {section.name}
        </h1>
        <p className="mt-3 font-latin text-sm text-content-subtle">
          {prompts.length} برومبت
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 py-10 sm:grid-cols-2 lg:grid-cols-3">
        {prompts.map((prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} />
        ))}
      </div>
    </main>
  );
}
