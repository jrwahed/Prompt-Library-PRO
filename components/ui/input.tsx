import * as React from "react";
import { cn } from "@/lib/utils";

const INPUT_CLASS =
  "flex w-full rounded-lg border border-hairline bg-surface-raised px-3 py-2 text-sm text-content transition-colors placeholder:text-content-subtle hover:border-hairline-strong focus-visible:border-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/40 disabled:cursor-not-allowed disabled:opacity-50";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input type={type} ref={ref} className={cn(INPUT_CLASS, "h-10", className)} {...props} />
    );
  }
);
Input.displayName = "Input";

export { Input, INPUT_CLASS };
