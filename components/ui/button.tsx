import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
  {
    variants: {
      variant: {
        default:
          "bg-brand-900 text-white shadow-brand hover:bg-brand-700 active:bg-brand-800 dark:bg-brand-500 dark:hover:bg-brand-400",
        secondary:
          "bg-brand-50 text-brand-900 hover:bg-brand-100 dark:bg-brand-900/60 dark:text-brand-100 dark:hover:bg-brand-800",
        outline:
          "border border-hairline-strong bg-transparent text-content hover:border-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/40",
        ghost: "bg-transparent text-content hover:bg-surface-sunken",
        chip: "border border-hairline bg-surface-sunken text-content-muted hover:border-brand-400 hover:bg-brand-50 hover:text-brand-900 dark:hover:bg-brand-900/50 dark:hover:text-brand-100",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-xl px-6 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
