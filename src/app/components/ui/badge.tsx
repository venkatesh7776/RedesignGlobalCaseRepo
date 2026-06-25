import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none transition-[color,background-color,border-color] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-[#DCEEF4] bg-tint text-ink [a&]:hover:bg-[#D7EEF5]",
        secondary:
          "border-line bg-white text-deep [a&]:hover:bg-tint",
        destructive:
          "border-[#FBD5D5] bg-[#FEF2F2] text-[#B91C1C] [a&]:hover:bg-[#FDE6E6]",
        outline:
          "border-line text-[#5B6B78] [a&]:hover:bg-tint [a&]:hover:text-ink",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
