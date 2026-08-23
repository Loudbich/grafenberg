import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-deep disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 font-orbitron relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-neon-orange to-neon-magenta text-white hover:shadow-[0_0_24px_rgba(255,106,0,0.45)] hover:scale-105 border-2 animate-border-pulse",
        destructive: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-[0_0_24px_rgba(239,68,68,0.45)] hover:scale-105 border-2 border-red-400/50",
        outline: "glass-animated-border text-white hover:bg-white/10 hover:shadow-[0_0_16px_rgba(255,255,255,0.2)]",
        secondary: "bg-gradient-to-r from-neon-cyan to-neon-violet text-white hover:shadow-[0_0_24px_rgba(0,246,255,0.45)] hover:scale-105 border-2 animate-border-pulse",
        ghost: "text-white hover:bg-white/10 hover:text-neon-cyan backdrop-blur-md",
        link: "text-neon-cyan underline-offset-4 hover:underline hover:text-neon-orange transition-colors",
        streaming: "glass-animated-border text-white hover:bg-white/10 hover:shadow-[0_0_16px_rgba(255,255,255,0.15)]"
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-lg px-4",
        lg: "h-14 rounded-xl px-10 text-base",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
