import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-surface/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-6">
        <Logo size="md" />
        <div className="flex items-center gap-4">
          <span className="hidden font-latin text-xs text-content-subtle sm:inline">
            أداة داخلية
          </span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
