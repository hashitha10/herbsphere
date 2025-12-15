import React from "react";

export default function LotusIcon({
  size = 70,
  className = "",
  glow = true,
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={`${glow ? "hover:animate-lotusGlow" : ""} ${className}`}
    >
      <path
        d="M32 58s-12-7-20-16S6 20 16 16c3-.8 7 3 10 6 3-3 7-6.6 10-6 14 4 18 20 8 30S32 58 32 58z"
        fill="#ff82c5"
        stroke="#c93c80"
        strokeWidth="2"
      />
      <path
        d="M10 24s6-8 20-8 20 8 20 8"
        fill="#ffb2d9"
        stroke="#c93c80"
        strokeWidth="2"
      />
      <path
        d="M32 6s5 8 14 14"
        stroke="#c93c80"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M32 6s-5 8-14 14"
        stroke="#c93c80"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}
