import { useTheme } from "../../../context/ThemeContext";

export default function FeatureArt({ feature, className = "" }) {
  const { dark } = useTheme();
  if (feature === "ai") return <AIFeature dark={dark} className={className} />;
  if (feature === "practice") return <PracticeFeature dark={dark} className={className} />;
  if (feature === "progress") return <ProgressFeature dark={dark} className={className} />;
  return <AchievementsFeature dark={dark} className={className} />;
}

function AIFeature({ dark, className }) {
  const blob = dark ? "#8B5CF6" : "#4CAF7D";
  const blobD = dark ? "#7C3AED" : "#3D9A6C";
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label="AI lessons">
      <defs>
        <radialGradient id="fAIGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={blob} stopOpacity="0.35" />
          <stop offset="100%" stopColor={blob} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fAIBlob" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={blob} />
          <stop offset="100%" stopColor={blobD} />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="50" fill="url(#fAIGlow)" className="anim-glow" />
      <g transform="translate(60 60)" className="anim-bob">
        <path d="M-22 -8 C -27 -20 -14 -26 0 -24 C 14 -26 27 -20 22 -8 C 28 2 25 16 14 20 C 6 23 -6 23 -14 20 C -25 16 -28 2 -22 -8 Z" fill="url(#fAIBlob)" />
        <g className="anim-blink" style={{ transformOrigin: "center" }}>
          <ellipse cx="-7" cy="-4" rx="3" ry="4" fill="#fff" />
          <ellipse cx="7" cy="-4" rx="3" ry="4" fill="#fff" />
          <circle cx="-7" cy="-3" r="2" fill="#2F3E2E" />
          <circle cx="7" cy="-3" r="2" fill="#2F3E2E" />
        </g>
        <path d="M-5 6 Q 0 11 5 6" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
        <line x1="0" y1="-24" x2="0" y2="-32" stroke={blob} strokeWidth="2" strokeLinecap="round" />
        <path d="M0 -36 L1.5 -31 L6 -30 L2 -27 L3 -22 L0 -25 L-3 -22 L-2 -27 L-6 -30 L-1.5 -31 Z" fill={dark ? "#FFD166" : "#FFC857"} className="anim-glow" />
      </g>
      <circle cx="20" cy="30" r="3" fill={blob} className="anim-floaty-sm" opacity="0.6" />
      <circle cx="100" cy="80" r="2.5" fill={dark ? "#FFD166" : "#FFC857"} className="anim-floaty" opacity="0.6" />
    </svg>
  );
}

function PracticeFeature({ dark, className }) {
  const accent = dark ? "#8B5CF6" : "#4CAF7D";
  const gold = dark ? "#FFD166" : "#FFC857";
  const bubble = dark ? "#1A143D" : "#FFFFFF";
  const border = dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)";
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label="Interactive practice">
      <g transform="translate(20 25)" className="anim-floaty">
        <rect x="0" y="0" width="60" height="36" rx="18" fill={bubble} stroke={border} strokeWidth="1" />
        <circle cx="14" cy="18" r="5" fill={accent} />
        <rect x="24" y="13" width="28" height="3" rx="1.5" fill={dark ? "#D8D4F2" : "#CCC"} />
        <rect x="24" y="20" width="18" height="3" rx="1.5" fill={dark ? "#D8D4F2" : "#DDD"} />
        <path d="M10 32 L6 40 L16 34 Z" fill={bubble} />
      </g>
      <g transform="translate(50 65)" className="anim-floaty-sm" style={{ animationDelay: "0.5s" }}>
        <rect x="0" y="0" width="50" height="28" rx="14" fill={accent} opacity="0.9" />
        <rect x="10" y="10" width="24" height="3" rx="1.5" fill="#fff" opacity="0.7" />
        <rect x="10" y="16" width="16" height="3" rx="1.5" fill="#fff" opacity="0.5" />
        <path d="M40 24 L46 30 L36 26 Z" fill={accent} opacity="0.9" />
      </g>
      <g transform="translate(30 100)">
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={i * 6} y="-6" width="3" height="12" rx="1.5" fill={gold} style={{ transformOrigin: "center", animation: "mg-wave-bar 0.7s ease-in-out infinite", animationDelay: (i * 0.1) + "s" }} />
        ))}
      </g>
    </svg>
  );
}

function ProgressFeature({ dark, className }) {
  const accent = dark ? "#8B5CF6" : "#4CAF7D";
  const gold = dark ? "#FFD166" : "#FFC857";
  const pink = "#FF8FB1";
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label="Real progress">
      <line x1="20" y1="90" x2="100" y2="90" stroke={dark ? "#3A2D5A" : "#E8D5A8"} strokeWidth="2" strokeLinecap="round" />
      <rect x="28" y="65" width="12" height="25" rx="3" fill={pink} className="anim-floaty-sm" />
      <rect x="50" y="50" width="12" height="40" rx="3" fill={accent} className="anim-floaty-sm" style={{ animationDelay: "0.3s" }} />
      <rect x="72" y="35" width="12" height="55" rx="3" fill={gold} className="anim-floaty-sm" style={{ animationDelay: "0.6s" }} />
      <g transform="translate(78 28)" className="anim-glow">
        <path d="M0 -8 L2 -2.5 L8 -2 L3.5 2 L5 8 L0 4.5 L-5 8 L-3.5 2 L-8 -2 L-2 -2.5 Z" fill={gold} />
      </g>
      <path d="M30 70 L50 55 L70 40" stroke={accent} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeDasharray="3 3" opacity="0.5" />
    </svg>
  );
}

function AchievementsFeature({ dark, className }) {
  const gold = dark ? "#FFD166" : "#FFC857";
  const goldD = dark ? "#E8B940" : "#E8A830";
  const accent = dark ? "#8B5CF6" : "#4CAF7D";
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label="Achievements">
      <g transform="translate(25 25)" className="anim-glow">
        <path d="M0 -8 L2 -2.5 L8 -2 L3.5 2 L5 8 L0 4.5 L-5 8 L-3.5 2 L-8 -2 L-2 -2.5 Z" fill={gold} />
      </g>
      <g transform="translate(95 30) scale(0.7)" className="anim-glow" style={{ animationDelay: "0.5s" }}>
        <path d="M0 -8 L2 -2.5 L8 -2 L3.5 2 L5 8 L0 4.5 L-5 8 L-3.5 2 L-8 -2 L-2 -2.5 Z" fill={gold} />
      </g>
      <g transform="translate(60 60)" className="anim-floaty">
        <path d="M-18 -20 L18 -20 L16 10 Q 16 20 0 22 Q -16 20 -16 10 Z" fill={gold} />
        <path d="M-18 -20 L18 -20 L16 10 Q 16 20 0 22 Q -16 20 -16 10 Z" fill={goldD} opacity="0.3" />
        <path d="M-18 -15 Q -28 -10 -26 0 Q -24 8 -16 6" stroke={gold} strokeWidth="3" fill="none" />
        <path d="M18 -15 Q 28 -10 26 0 Q 24 8 16 6" stroke={gold} strokeWidth="3" fill="none" />
        <path d="M0 -8 L2 -2.5 L8 -2 L3.5 2 L5 8 L0 4.5 L-5 8 L-3.5 2 L-8 -2 L-2 -2.5 Z" fill="#fff" opacity="0.8" />
        <rect x="-4" y="22" width="8" height="10" fill={goldD} />
        <rect x="-14" y="32" width="28" height="6" rx="2" fill={goldD} />
      </g>
      <path d="M40 90 L45 100 L50 92 Z" fill={accent} />
      <path d="M70 90 L75 100 L80 92 Z" fill={accent} />
    </svg>
  );
}
