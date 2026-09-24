// Icônes SVG inline faites main — stroke currentColor, viewBox 24. Zéro emoji.
import React from "react";

type P = React.SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 20, ...props }: P, path: React.ReactNode) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {path}
    </svg>
  );
}

export const IconPhone = (p: P) => base(p, <><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2.1L8.1 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.6 2Z" /></>);
export const IconMail = (p: P) => base(p, <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></>);
export const IconPin = (p: P) => base(p, <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>);
export const IconBed = (p: P) => base(p, <><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" /><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" /><path d="M12 4v6" /><path d="M2 17h20" /></>);
export const IconArea = (p: P) => base(p, <><rect x="3" y="3" width="18" height="18" rx="1" /><path d="M3 9h6V3" /><path d="M9 21v-6h12" /></>);
export const IconHeart = (p: P & { filled?: boolean }) => (
  <svg width={p.size ?? 20} height={p.size ?? 20} viewBox="0 0 24 24" fill={p.filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 14c1.5-1.5 3-3.3 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3.4 1-4.5 2.5C10.9 4 9.3 3 7.5 3A5.5 5.5 0 0 0 2 8.5c0 2.2 1.5 4 3 5.5l7 7Z" /></svg>
);
export const IconSearch = (p: P) => base(p, <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>);
export const IconArrow = (p: P) => base(p, <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>);
export const IconClose = (p: P) => base(p, <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>);
export const IconMenu = (p: P) => base(p, <><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></>);
export const IconPlay = (p: P) => base(p, <><circle cx="12" cy="12" r="10" /><path d="m10 8 6 4-6 4V8Z" /></>);
export const IconCube = (p: P) => base(p, <><path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7Z" /><path d="M3.3 7 12 12l8.7-5" /><path d="M12 22V12" /></>);
export const IconMap = (p: P) => base(p, <><path d="M9 20 2 17V4l7 3" /><path d="M9 20v-3" /><path d="M15 4v3" /><path d="M9 17l6-3" /><path d="M22 7v13l-7-3-6 3V7l6-3 7 3Z" /></>);
export const IconQr = (p: P) => base(p, <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 14h3v3h-3z" /><path d="M21 14v7h-7" /></>);
export const IconChat = (p: P) => base(p, <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" /></>);
export const IconCheck = (p: P) => base(p, <><path d="M20 6 9 17l-5-5" /></>);
export const IconStar = (p: P) => base(p, <><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2Z" /></>);
export const IconClock = (p: P) => base(p, <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>);

// Monogramme BM — logo de repli dessiné main (remplacé si logoUrl admin).
export function LogoBM({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-label="Ben Melissa">
      <rect x="1" y="1" width="46" height="46" rx="2" stroke="#c9a86a" strokeWidth="1.5" />
      <text x="24" y="30" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="19" letterSpacing="1" fill="#e8d5a8">BM</text>
      <path d="M10 36h28" stroke="#c9a86a" strokeWidth="1" />
    </svg>
  );
}
