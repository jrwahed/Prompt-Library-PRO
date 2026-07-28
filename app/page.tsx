import { SearchBar } from "@/components/SearchBar";
import { SectionCard } from "@/components/SectionCard";
import { QuickAccessRows } from "@/components/home/QuickAccessRows";
import { getAllPrompts, getPromptCountForSection, getSections } from "@/lib/library";

export default function HomePage() {
  const sections = getSections();
  const prompts = getAllPrompts();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center gap-10 px-6 py-12">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">🚀 Company Prompt OS</h1>
        <p className="max-w-xl text-zinc-500 dark:text-zinc-400">
          اختار قسم، اختار برومبت جاهز، املأ الفراغات، وانسخ النتيجة. صفر AI، صفر تكلفة، فوري.
        </p>
      </div>

      <SearchBar prompts={prompts} sections={sections} />

      <QuickAccessRows prompts={prompts} />

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <SectionCard
            key={section.id}
            section={section}
            count={getPromptCountForSection(section.id)}
          />
        ))}
      </div>
    </main>
  );
}
