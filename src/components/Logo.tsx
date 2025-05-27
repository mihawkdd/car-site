import { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 200 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Van Body */}
      <path
        d="M20 70 L20 40 Q20 30 30 30 L170 30 Q180 30 180 40 L180 70"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      
      {/* Wheels */}
      <circle cx="50" cy="70" r="10" fill="currentColor" />
      <circle cx="150" cy="70" r="10" fill="currentColor" />
      
      {/* Windows */}
      <path
        d="M30 40 L80 40 L70 55 L30 55 Z"
        fill="currentColor"
      />
      
      {/* AUNT Text */}
      <text
        x="100"
        y="48"
        fontFamily="Arial Black, sans-serif"
        fontSize="20"
        fontWeight="bold"
        fill="currentColor"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        AUNT
      </text>
    </svg>
  );
}