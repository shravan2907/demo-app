"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}
  >
    {/* Track */}
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-primary/20">
      <SliderPrimitive.Range className="absolute h-full bg-primary transition-all" />
    </SliderPrimitive.Track>

    {/* Thumb with Framer Motion */}
    <SliderPrimitive.Thumb asChild>
      <motion.div
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="block h-5 w-5 rounded-full border border-primary/50 bg-background shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      />
    </SliderPrimitive.Thumb>
  </SliderPrimitive.Root>
));

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
