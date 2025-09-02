
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

interface RusticIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    tooltip?: string;
}

export const RusticIconButton = React.forwardRef<HTMLButtonElement, RusticIconButtonProps>(
  ({ className, children, tooltip, ...props }, ref) => {
    
    const button = (
        <button
            ref={ref}
            className={cn(
                "relative h-12 w-12 flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
                className
            )}
            {...props}
        >
            <svg
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 h-full w-full"
                >
                <path
                    d="M 50,6
                    C 28,6, 8,24, 8,50
                    S 25,93, 50,94
                    S 92,75, 92,50
                    S 72,6, 50,6 Z"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    transform="rotate(-10 50 50) translate(0 1)"
                />
            </svg>
            <div className="transition-transform group-hover:scale-110">
              {children}
            </div>
        </button>
    );

    if (!tooltip) {
        return button;
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side="bottom" align="center">
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  }
);
RusticIconButton.displayName = "RusticIconButton";
