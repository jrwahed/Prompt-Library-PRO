import { SearchBar } from "@/components/SearchBar";
import { SectionCard } from "@/components/SectionCard";
import { QuickAccessRows } from "@/components/home/QuickAccessRows";
import { getAllPrompts, getPromptCountForSection, getSections } from "@/lib/library";

export default function HomePage() {
  const sections = getSections();
  const prompts = getAllPrompts();

  const stats = [
    { value: sections.length, label: "قسم" },
    { value: prompts.length, label: "برومبت جاهز" },
    { value: "0", label: "تكلفة تشغيل" },
  ];

  return (
    <main className="flex w-full flex-1 flex-col items-center">
      {/* Hero */}
      <section className="brand-aurora relative w-full border-b border-hairline">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-6 py-16 text-center sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-raised/70 px-4 py-1.5 text-xs font-semibold text-content-muted backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            أداة داخلية · Brand Shift Marketing Agency
          </span>

          <div className="flex max-w-3xl flex-col gap-4">
            <h1 className="text-balance text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl">
              مكتبة البرومبتات
              <span className="block bg-gradient-to-l from-brand-500 to-brand-300 bg-clip-text text-transparent">
                اللي الفريق بيشتغل بيها كل يوم
              </span>
            </h1>
            <p className="text-pretty text-base leading-relaxed text-content-muted sm:text-lg">
              اختار قسم، افتح برومبت جاهز، املأ الفراغات، وانسخ النتيجة. من غير تجربة
              وتخمين، ومن غير ما تدفع على كل استخدام.
            </p>
          </div>

          <SearchBar prompts={prompts} sections={sections} />

          <dl className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 pt-2">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center">
                <dt className="font-display text-3xl font-extrabold text-content">{s.value}</dt>
                <dd className="text-xs font-medium text-content-subtle">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-6 py-14">
        <QuickAccessRows prompts={prompts} />

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">كل الأقسام</h2>
            <p className="text-sm text-content-muted">
              مقسّمة بالدور — اختار اللي بيوصف شغلك.
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                count={getPromptCountForSection(section.id)}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
