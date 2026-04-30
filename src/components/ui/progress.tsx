import * as React from "react";
import { Progress as ProgressPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const progressVariants = cva("bg-primary", {
  variants: {
    variant: {
      default: "size-full flex-1  transition-all",
      outline:
        "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
      ghost:
        "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
      destructive:
        "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
      link: "text-primary underline-offset-4 hover:underline",
      info: "bg-yellow-400 text-white  hover:text-yellow-400 data-[state=on]:bg-white data-[state=on]:text-yellow-400",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

function Progress({
  className,
  value,
  variant = "default",
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> &
  VariantProps<typeof progressVariants>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative flex h-1 w-full items-center bg-gray-300 overflow-x-hidden rounded-full",
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(progressVariants({ className, variant }))}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
