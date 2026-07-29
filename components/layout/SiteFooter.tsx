import { Logo } from "@/components/brand/Logo";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-hairline">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-start justify-between gap-5 px-6 py-9 sm:flex-row sm:items-center">
        <Logo size="sm" />
        <p className="font-latin text-xs leading-relaxed text-content-subtle sm:text-end">
          البرومبتات والمفضلة بتفضل على جهازك — مفيش سيرفر بيسجّل حاجة.
          <br />© {new Date().getFullYear()} Brand Shift Marketing Agency
        </p>
      </div>
    </footer>
  );
}
