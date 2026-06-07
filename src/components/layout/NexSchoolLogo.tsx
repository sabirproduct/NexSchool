import React from "react";

const NexSchoolLogo = () => {
  return (
    <svg
      viewBox="0 0 800 220"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", margin: "0 auto" }}
    >
      <defs>
        <linearGradient id="gradBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient> 
      </defs>

      {/* Icon */}
      <g transform="translate(40,40)">
        <circle cx="70" cy="70" r="60" fill="url(#gradBlue)" />

        <polygon
          points="20,55 70,30 120,55 70,80"
          fill="#FFFFFF"
        />

        <line
          x1="105"
          y1="60"
          x2="105"
          y2="95"
          stroke="#FFFFFF"
          strokeWidth="4"
        />

        <circle cx="105" cy="98" r="4" fill="#FFFFFF" />

        <path
          d="M40 85 Q55 75 70 85 L70 120 Q55 110 40 120 Z"
          fill="#FFFFFF"
          opacity="0.95"
        />

        <path
          d="M70 85 Q85 75 100 85 L100 120 Q85 110 70 120 Z"
          fill="#FFFFFF"
          opacity="0.95"
        />

        <line
          x1="70"
          y1="85"
          x2="70"
          y2="120"
          stroke="#2563EB"
          strokeWidth="2"
        />
      </g>

      {/* Brand Name */}
      <text
        x="180"
        y="105"
        fontFamily="Segoe UI, Arial, sans-serif"
        fontSize="64"
        fontWeight="700"
        fill="#1E293B"
      >
        Nex<tspan fill="#2563EB">School</tspan>
      </text>

      {/* Tagline */}
      <text
        x="185"
        y="145"
        fontFamily="Segoe UI, Arial, sans-serif"
        fontSize="22"
        fill="#64748B"
      >
        Powered by Nexbizion Systems
      </text>

      {/* Accent Line */}
      <line
        x1="185"
        y1="160"
        x2="520"
        y2="160"
        stroke="#06B6D4"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default NexSchoolLogo;