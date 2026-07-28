import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Brand Shift mark — the "B" with the ring counter and the rising arrow.
 *
 * The letterform is drawn in `currentColor`; the arrow is knocked out in the
 * page surface colour so the mark inverts correctly between light and dark.
 * To swap in the official vector, replace the two paths below — everything
 * else (sizing, colour, spacing) keeps working.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label="Brand Shift"
      className={cn("shrink-0", className)}
    >
      <g className="fill-current">
        {/* stem + top lobe */}
        <path d="M4 3h42a23.5 23.5 0 0 1 0 47H4z" />
        <path d="M4 3h24v62H4z" />
        {/* bottom bowl, punched with the ring counter */}
        <path
          fillRule="evenodd"
          d="M38 30a34 34 0 1 1 0 68 34 34 0 0 1 0-68m0 17a17 17 0 1 0 0 34 17 17 0 0 0 0-34"
        />
      </g>
      <g className="fill-surface">
        {/* rising arrow, knocked out of the letterform */}
        <path d="M11 58C11 36 24 24 44 20l2 11c-15 4-28 13-28 27z" />
        <path d="M40 6 63 20 44 33z" />
      </g>
    </svg>
  );
}

const SIZES = {
  sm: { mark: "h-8 w-8", name: "text-sm", tag: "text-[7px] tracking-[0.3em]" },
  md: { mark: "h-10 w-10", name: "text-lg", tag: "text-[8px] tracking-[0.32em]" },
  lg: { mark: "h-16 w-16", name: "text-3xl", tag: "text-[11px] tracking-[0.34em]" },
} as const;

export function Logo({
  size = "md",
  href = "/",
  className,
}: {
  size?: keyof typeof SIZES;
  href?: string | null;
  className?: string;
}) {
  const s = SIZES[size];

  const content = (
    <>
      <BrandMark className={cn(s.mark, "text-brand-900 dark:text-white")} />
      <span className="flex flex-col justify-center gap-0.5 leading-none" dir="ltr">
        <span className={cn("font-display font-extrabold tracking-tight text-content", s.name)}>
          BRAND<span className="text-brand-500 dark:text-brand-300">SHIFT</span>
        </span>
        <span className={cn("font-display font-medium text-content-subtle", s.tag)}>
          MARKETING AGENCY
        </span>
      </span>
    </>
  );

  const classes = cn("flex items-center gap-2.5", className);

  if (!href) return <span className={classes}>{content}</span>;

  return (
    <Link href={href} className={cn(classes, "transition-opacity hover:opacity-80")}>
      {content}
    </Link>
  );
}
