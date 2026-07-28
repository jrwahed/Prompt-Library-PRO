import { Logo } from "@/components/brand/Logo";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-hairline bg-surface-raised/40">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 sm:flex-row">
        <Logo size="sm" />
        <p className="text-center text-xs text-content-subtle sm:text-end">
          أداة داخلية لفريق Brand Shift — البرومبتات والبيانات كلها بتفضل على جهازك.
          <br />© {new Date().getFullYear()} Brand Shift Marketing Agency.
        </p>
      </div>
    </footer>
  );
}
