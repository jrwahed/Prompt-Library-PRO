import * as React from "react";
import { INPUT_CLASS } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(INPUT_CLASS, "min-h-24 resize-y leading-relaxed", className)}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
