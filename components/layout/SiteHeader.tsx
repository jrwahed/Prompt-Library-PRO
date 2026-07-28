import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-6">
        <Logo size="md" />

        <div className="flex items-center gap-3">
          <span className="hidden rounded-full border border-hairline bg-surface-raised px-3 py-1 text-xs font-medium text-content-muted sm:inline-block">
            Prompt OS · داخلي
          </span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
