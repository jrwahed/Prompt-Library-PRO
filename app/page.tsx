import { SearchBar } from "@/components/SearchBar";
import { SectionCard } from "@/components/SectionCard";
import { QuickAccessRows } from "@/components/home/QuickAccessRows";
import { getAllPrompts, getPromptCountForSection, getSections } from "@/lib/library";

export default function HomePage() {
  const sections = getSections();
  const prompts = getAllPrompts();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6">
      {/* Masthead — a tool's header, not a landing page hero. */}
      <section className="border-b border-hairline py-14 sm:py-20">
        <p className="eyebrow">Brand Shift · Prompt Library</p>

        <h1 className="mt-5 max-w-2xl text-4xl font-extrabold leading-[1.2] tracking-tight sm:text-[3.25rem] sm:leading-[1.15]">
          مكتبة البرومبتات اللي الفريق
          <span className="text-content-subtle"> بيشتغل بيها كل يوم</span>
        </h1>

        <p className="mt-5 max-w-lg leading-relaxed text-content-muted">
          اختار قسم، افتح برومبت جاهز، املأ الفراغات، وانسخ النتيجة.
        </p>

        <div className="mt-9 max-w-xl">
          <SearchBar prompts={prompts} sections={sections} />
        </div>

        <p className="mt-5 font-latin text-xs text-content-subtle">
          {prompts.length} برومبت · {sections.length} قسم
        </p>
      </section>

      <QuickAccessRows prompts={prompts} />

      <section className="py-14">
        <div className="flex items-baseline justify-between gap-4 pb-5">
          <h2 className="text-lg font-bold">الأقسام</h2>
          <p className="text-sm text-content-subtle">مقسّمة بالدور</p>
        </div>

        {/* A shared-edge index rather than floating cards — this is a catalogue. */}
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-card border border-hairline bg-hairline md:grid-cols-2">
          {sections.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              count={getPromptCountForSection(section.id)}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
