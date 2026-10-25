import { useTheme } from "../../../context/ThemeContext";

export default function CTAArt({ className = "" }) {
  const { dark } = useTheme();
  const accent = dark ? "#8B5CF6" : "#4CAF7D";
  const accent2 = dark ? "#7C3AED" : "#3D9A6C";
  const gold = dark ? "#FFD166" : "#FFC857";
  return (
    <svg viewBox="0 0 880 400" className={className} role="img" aria-label="A magical castle scene">
      <defs>
        <linearGradient id="ctaSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={dark ? "#09071B" : "#FFE8C8"} />
          <stop offset="100%" stopColor={dark ? "#1A143D" : "#FFF9EE"} />
        </linearGradient>
        <radialGradient id="ctaGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={gold} stopOpacity="0.4" />
          <stop offset="100%" stopColor={gold} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="880" height="400" fill="url(#ctaSky)" rx="24" />
      {dark && [40, 90, 200, 300, 400, 500, 600, 700, 800].map((x, i) => (
        <circle key={i} cx={x} cy={30 + (i * 35) % 120} r={i % 2 ? 1.3 : 2} fill="#fff" className="anim-glow" style={{ animationDelay: (i * 0.25) + "s" }} />
      ))}
      <circle cx="150" cy="80" r="45" fill={dark ? "#FFE8A3" : "#FFC857"} opacity="0.9" className="anim-glow" />
      <circle cx="150" cy="80" r="70" fill="url(#ctaGlow)" />
      <path d="M0 350 Q 440 310 880 350 L880 400 L0 400 Z" fill={dark ? "#09071B" : "#C9F2D3"} />
      <g transform="translate(440 330)" opacity="0.9">
        <rect x="-90" y="-60" width="180" height="60" rx="4" fill={dark ? "#1E1640" : "#C9F2D3"} />
        <rect x="-100" y="-100" width="30" height="100" fill={dark ? "#1E1640" : "#C9F2D3"} />
        <rect x="70" y="-100" width="30" height="100" fill={dark ? "#1E1640" : "#C9F2D3"} />
        <rect x="-30" y="-110" width="60" height="110" fill={dark ? "#160E33" : "#A8D8B8"} />
        <path d="M-100 -100 L-85 -125 L-70 -100 Z" fill={dark ? "#160E33" : "#A8D8B8"} />
        <path d="M70 -100 L85 -125 L100 -100 Z" fill={dark ? "#160E33" : "#A8D8B8"} />
        <path d="M-30 -110 L0 -140 L30 -110 Z" fill={dark ? "#160E33" : "#A8D8B8"} />
        <path d="M-85 -125 L-85 -135 L-75 -130 Z" fill="#FF6B9D" />
        <path d="M85 -125 L85 -135 L95 -130 Z" fill="#FF6B9D" />
        <path d="M0 -140 L0 -152 L14 -146 Z" fill={gold} />
        <rect x="-90" y="-80" width="8" height="12" rx="1" fill={gold} className="anim-flicker" />
        <rect x="82" y="-80" width="8" height="12" rx="1" fill={gold} className="anim-flicker" />
        <rect x="-12" y="-90" width="10" height="14" rx="2" fill={gold} className="anim-flicker" />
        <rect x="-60" y="-40" width="8" height="12" rx="1" fill={gold} className="anim-flicker" />
        <rect x="52" y="-40" width="8" height="12" rx="1" fill={gold} className="anim-flicker" />
        <path d="M-15 0 L-15 -25 Q 0 -35 15 -25 L15 0 Z" fill={dark ? "#160E33" : "#A8D8B8"} />
      </g>
      {[[120, 110, 32, "#FF8FB1"], [760, 90, 26, "#9DADF0"], [700, 170, 20, "#4CAF7D"]].map(([cx, cy, r, c], i) => (
        <g key={i} transform={"translate(" + cx + " " + cy + ")"} className="anim-floaty" style={{ animationDelay: (i * 0.5) + "s" }}>
          <ellipse cx="0" cy="0" rx={r} ry={r * 1.1} fill={c} />
          <rect x="-10" y={r * 0.85} width="20" height="14" rx="2" fill={dark ? "#4A3B6E" : "#8B6F47"} />
          <line x1="0" y1="0" x2="0" y2={-r} stroke={dark ? "#4A3B6E" : "#8B6F47"} strokeWidth="2" />
        </g>
      ))}
      {[[250, 100], [350, 80], [550, 90], [650, 120], [200, 180], [500, 150]].map(([x, y], i) => (
        <g key={i} transform={"translate(" + x + " " + y + ")"} className="anim-floaty" style={{ animationDelay: (i * 0.4) + "s" }}>
          <ellipse cx="0" cy="0" rx="8" ry="10" fill={gold} className="anim-flicker" />
          <ellipse cx="0" cy="0" rx="16" ry="18" fill={gold} opacity="0.15" />
        </g>
      ))}
      <g transform="translate(440 200)" className="anim-floaty" style={{ animationDelay: "0.8s" }}>
        <path d="M-70 15 Q -75 32 -50 38 L50 38 Q 75 32 70 15 Z" fill={dark ? "#4A3B6E" : "#8B6F47"} />
        <line x1="0" y1="15" x2="0" y2="-45" stroke={dark ? "#4A3B6E" : "#8B6F47"} strokeWidth="4" strokeLinecap="round" />
        <path d="M0 -40 L42 -12 L0 -5 Z" fill={dark ? "#B794F6" : "#F5E6D3"} className="anim-sway" style={{ transformOrigin: "0px -10px" }} />
        <path d="M0 -40 L-42 -12 L0 -5 Z" fill={dark ? "#B794F6" : "#F5E6D3"} opacity="0.7" className="anim-sway" style={{ transformOrigin: "0px -10px", animationDelay: "0.3s" }} />
        <path d="M0 -45 L14 -40 L0 -34 Z" fill="#FF6B9D" />
      </g>
      {dark && [[300, 230], [550, 250], [180, 260], [700, 240]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill={gold} className="anim-glow" style={{ animationDelay: (i * 0.5) + "s" }} />
      ))}
    </svg>
  );
}
