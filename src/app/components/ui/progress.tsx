"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "./utils";

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-1 w-full overflow-hidden rounded-full bg-[#EEF3F6]",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full w-full flex-1 rounded-full transition-all duration-300"
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`,
          background: "linear-gradient(90deg, #9BDAEC, #3FB5D7)",
        }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
