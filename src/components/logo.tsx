import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="100"
      height="100"
      {...props}
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "hsl(var(--accent))", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path
        d="M20 80 C20 40, 40 20, 50 20 S80 40, 80 80 L60 80 C60 50, 50 40, 50 40 C50 40, 40 50, 40 80 Z"
        stroke="url(#grad1)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M30 70 L70 70 M40 60 L60 60 M45 50 L55 50"
        stroke="hsl(var(--border))"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
