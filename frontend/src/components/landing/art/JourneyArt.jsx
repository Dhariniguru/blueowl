import { useTheme } from "../../../context/ThemeContext";

export default function JourneyArt({ step, className = "" }) {
  const { dark } = useTheme();
  if (step === "explore") return <ExploreScene dark={dark} className={className} />;
  if (step === "learn") return <LearnScene dark={dark} className={className} />;
  return <MasterScene dark={dark} className={className} />;
}

function ExploreScene({ dark, className }) {
  const sky = dark ? "#120B2F" : "#DFF4FF";
  const ground = dark ? "#1E1640" : "#4CAF7D";
  const groundL = dark ? "#2A1F4A" : "#6BCB8A";
  const dress = dark ? "#8B5CF6" : "#4CAF7D";
  const dressD = dark ? "#7C3AED" : "#3D9A6C";
  const hair = dark ? "#3D2B5E" : "#5C3D2E";
  const skin = "#F8D5B5";
  const cat = dark ? "#3A2D5A" : "#2F3E2E";
  const path = dark ? "#4A3B6E" : "#E8D5A8";
  return (
    <svg viewBox="0 0 240 200" className={className} role="img" aria-label="A child exploring with a map">
      <rect width="240" height="200" fill={sky} rx="16" />
      {dark && [[30, 25], [80, 15], [180, 30], [210, 50]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.2" fill="#fff" className="anim-glow" style={{ animationDelay: (i * 0.4) + "s" }} />
      ))}
      {!dark && <circle cx="200" cy="35" r="18" fill="#FFC857" className="anim-glow" />}
      <path d="M0 140 Q 120 125 240 140 L240 200 L0 200 Z" fill={ground} />
      <ellipse cx="120" cy="145" rx="150" ry="15" fill={groundL} opacity="0.5" />
      <path d="M120 200 Q 100 170 120 150 Q 140 130 120 110" stroke={path} strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray="4 6" />
      <g transform="translate(120 110)">
        <path d="M-18 0 Q -24 20 -20 40 L20 40 Q 24 20 18 0 Z" fill={dress} />
        <path d="M-18 0 Q -24 20 -20 40 L20 40 Q 24 20 18 0 Z" fill={dressD} opacity="0.2" />
        <rect x="-12" y="40" width="8" height="15" rx="3" fill={dressD} />
        <rect x="4" y="40" width="8" height="15" rx="3" fill={dressD} />
        <path d="M-18 5 Q -28 0 -25 -10" stroke={skin} strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M18 5 Q 28 0 25 -10" stroke={skin} strokeWidth="7" fill="none" strokeLinecap="round" />
        <g transform="translate(0 -15) rotate(-5)" className="anim-sway" style={{ transformOrigin: "0px 0px" }}>
          <rect x="-16" y="-12" width="32" height="24" rx="2" fill="#FFF5E0" />
          <path d="M-12 -8 Q 0 -4 12 -8 M-12 0 Q 0 4 12 0" stroke={dress} strokeWidth="1.5" fill="none" />
          <circle cx="8" cy="4" r="2" fill="#FF6B9D" />
        </g>
        <g className="anim-breathe" style={{ transformOrigin: "0px -25px" }}>
          <path d="M-20 -40 Q -25 -15 -20 5 L20 5 Q 25 -15 20 -40 Z" fill={hair} />
          <circle cx="0" cy="-22" r="18" fill={skin} />
          <path d="M-18 -38 Q -12 -44 0 -42 Q 12 -44 18 -38 Q 14 -34 0 -36 Q -14 -34 -18 -38 Z" fill={hair} />
          <path d="M-16 -38 L0 -60 L16 -38 Z" fill={dark ? "#1A143D" : "#2F3E2E"} />
          <ellipse cx="0" cy="-38" rx="20" ry="4" fill={dark ? "#1A143D" : "#2F3E2E"} />
          <rect x="-12" y="-42" width="24" height="3" fill="#FFD166" />
          <g className="anim-blink" style={{ transformOrigin: "center" }}>
            <ellipse cx="-6" cy="-22" rx="2" ry="3" fill="#2F3E2E" />
            <ellipse cx="6" cy="-22" rx="2" ry="3" fill="#2F3E2E" />
          </g>
          <circle cx="-10" cy="-16" r="3" fill="#FF8FB1" opacity="0.4" />
          <circle cx="10" cy="-16" r="3" fill="#FF8FB1" opacity="0.4" />
          <path d="M-3 -14 Q 0 -10 3 -14" stroke="#2F3E2E" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </g>
      </g>
      <g transform="translate(60 155)" className="anim-floaty-sm">
        <ellipse cx="0" cy="10" rx="14" ry="12" fill={cat} />
        <circle cx="0" cy="-5" r="11" fill={cat} />
        <path d="M-8 -14 L-4 -22 L0 -16 Z" fill={cat} />
        <path d="M8 -14 L4 -22 L0 -16 Z" fill={cat} />
        <ellipse cx="-4" cy="-5" rx="2" ry="3" fill={dark ? "#FFD166" : "#FFC857"} />
        <ellipse cx="4" cy="-5" rx="2" ry="3" fill={dark ? "#FFD166" : "#FFC857"} />
        <path d="M-2 0 L0 2 L2 0" stroke="#FF8FB1" strokeWidth="1" fill="none" />
        <path d="M12 8 Q 22 0 18 -10" stroke={cat} strokeWidth="5" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function LearnScene({ dark, className }) {
  const bg = dark ? "#120B2F" : "#FFF3DC";
  const desk = dark ? "#3A2D5A" : "#8B6F47";
  const deskD = dark ? "#2A1F4A" : "#6B5236";
  const dress = dark ? "#8B5CF6" : "#4CAF7D";
  const hair = dark ? "#3D2B5E" : "#5C3D2E";
  const skin = "#F8D5B5";
  const blob = dark ? "#8B5CF6" : "#4CAF7D";
  const book = dark ? "#B794F6" : "#9DADF0";
  return (
    <svg viewBox="0 0 240 200" className={className} role="img" aria-label="A child learning at a desk with an AI companion">
      <rect width="240" height="200" fill={bg} rx="16" />
      <rect x="20" y="20" width="60" height="50" rx="6" fill={dark ? "#1A143D" : "#DFF4FF"} opacity="0.6" />
      <line x1="50" y1="20" x2="50" y2="70" stroke={dark ? "#3A2D5A" : "#8B6F47"} strokeWidth="2" />
      <line x1="20" y1="45" x2="80" y2="45" stroke={dark ? "#3A2D5A" : "#8B6F47"} strokeWidth="2" />
      <rect x="65" y="68" width="12" height="10" fill={deskD} />
      <ellipse cx="71" cy="65" rx="8" ry="6" fill={dark ? "#2A1F4A" : "#4CAF7D"} />
      <rect x="40" y="140" width="160" height="12" rx="3" fill={desk} />
      <rect x="50" y="152" width="8" height="40" fill={deskD} />
      <rect x="182" y="152" width="8" height="40" fill={deskD} />
      <g transform="translate(120 100)">
        <path d="M-20 0 Q -28 20 -24 40 L24 40 Q 28 20 20 0 Z" fill={dress} />
        <g className="anim-breathe" style={{ transformOrigin: "0px -20px" }}>
          <path d="M-20 -35 Q -25 -10 -20 5 L20 5 Q 25 -10 20 -35 Z" fill={hair} />
          <circle cx="0" cy="-18" r="18" fill={skin} />
          <path d="M-18 -33 Q -10 -40 0 -38 Q 10 -40 18 -33 Q 14 -28 0 -30 Q -14 -28 -18 -33 Z" fill={hair} />
          <g className="anim-blink" style={{ transformOrigin: "center" }}>
            <ellipse cx="-6" cy="-18" rx="2" ry="3" fill="#2F3E2E" />
            <ellipse cx="6" cy="-18" rx="2" ry="3" fill="#2F3E2E" />
          </g>
          <circle cx="-10" cy="-12" r="3" fill="#FF8FB1" opacity="0.4" />
          <circle cx="10" cy="-12" r="3" fill="#FF8FB1" opacity="0.4" />
          <path d="M-3 -10 Q 0 -6 3 -10" stroke="#2F3E2E" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </g>
        <path d="M-20 10 Q -30 30 -25 42" stroke={skin} strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M20 10 Q 30 30 25 42" stroke={skin} strokeWidth="7" fill="none" strokeLinecap="round" />
      </g>
      <g transform="translate(120 138)">
        <path d="M-30 0 L0 -4 L30 0 L30 10 L0 6 L-30 10 Z" fill="#fff" />
        <path d="M-30 0 L0 -4 L0 6 L-30 10 Z" fill="#F0F0F0" />
        <line x1="-22" y1="3" x2="-6" y2="0" stroke="#BBB" strokeWidth="1" />
        <line x1="6" y1="0" x2="22" y2="3" stroke="#BBB" strokeWidth="1" />
      </g>
      <g transform="translate(195 95)" className="anim-bob">
        <circle cx="0" cy="0" r="28" fill={blob} opacity="0.2" className="anim-glow" />
        <path d="M-16 -5 C -20 -18 -10 -22 0 -20 C 10 -22 20 -18 16 -5 C 20 3 18 14 10 16 C 4 18 -4 18 -10 16 C -18 14 -20 3 -16 -5 Z" fill={blob} />
        <ellipse cx="-6" cy="-3" rx="2.5" ry="3.5" fill="#fff" />
        <ellipse cx="6" cy="-3" rx="2.5" ry="3.5" fill="#fff" />
        <circle cx="-6" cy="-2" r="1.5" fill="#2F3E2E" />
        <circle cx="6" cy="-2" r="1.5" fill="#2F3E2E" />
        <path d="M-4 5 Q 0 9 4 5" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </g>
      <g transform="translate(45 95) rotate(-10)" className="anim-floaty">
        <rect x="-12" y="-9" width="24" height="18" rx="2" fill={book} />
        <rect x="-12" y="-9" width="4" height="18" rx="2" fill="rgba(0,0,0,0.2)" />
      </g>
    </svg>
  );
}

function MasterScene({ dark, className }) {
  const skyT = dark ? "#09071B" : "#FFE8C8";
  const skyB = dark ? "#1A143D" : "#FFF9EE";
  const castle = dark ? "#1E1640" : "#C9F2D3";
  const castleD = dark ? "#160E33" : "#A8D8B8";
  const dress = dark ? "#8B5CF6" : "#4CAF7D";
  const hair = dark ? "#FFD166" : "#FFC857";
  const skin = "#F8D5B5";
  const broom = dark ? "#4A3B6E" : "#8B6F47";
  return (
    <svg viewBox="0 0 240 200" className={className} role="img" aria-label="A master learner flying over a castle">
      <defs>
        <linearGradient id="msSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={skyT} />
          <stop offset="100%" stopColor={skyB} />
        </linearGradient>
      </defs>
      <rect width="240" height="200" fill="url(#msSky)" rx="16" />
      {dark
        ? [[30, 30], [80, 20], [180, 25], [210, 50], [50, 60]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="1.5" fill="#fff" className="anim-glow" style={{ animationDelay: (i * 0.3) + "s" }} />
          ))
        : [[40, 30, "#FF8FB1"], [200, 40, "#9DADF0"], [100, 20, "#FFC857"]].map(([x, y, c], i) => (
            <g key={i} transform={`translate(${x} ${y})`} className="anim-floaty-sm" style={{ animationDelay: (i * 0.5) + "s" }}>
              <path d="M0 -6 L1.5 -1.5 L6 0 L1.5 1.5 L0 6 L-1.5 1.5 L-6 0 L-1.5 -1.5 Z" fill={c} />
            </g>
          ))}
      <g transform="translate(120 165)">
        <rect x="-50" y="-30" width="100" height="30" fill={castle} />
        <rect x="-55" y="-45" width="20" height="45" fill={castle} />
        <rect x="35" y="-45" width="20" height="45" fill={castle} />
        <rect x="-15" y="-50" width="30" height="50" fill={castleD} />
        <path d="M-55 -45 L-45 -60 L-35 -45 Z" fill={castleD} />
        <path d="M35 -45 L45 -60 L55 -45 Z" fill={castleD} />
        <path d="M-15 -50 L0 -65 L15 -50 Z" fill={castleD} />
        <path d="M-45 -60 L-45 -68 L-38 -64 Z" fill="#FF6B9D" />
        <path d="M45 -60 L45 -68 L52 -64 Z" fill="#FF6B9D" />
        <rect x="-48" y="-35" width="6" height="8" rx="1" fill={dark ? "#FFD166" : "#FFE08A"} className="anim-flicker" />
        <rect x="42" y="-35" width="6" height="8" rx="1" fill={dark ? "#FFD166" : "#FFE08A"} className="anim-flicker" />
        <rect x="-3" y="-40" width="6" height="8" rx="1" fill={dark ? "#FFD166" : "#FFE08A"} className="anim-flicker" />
      </g>
      <g transform="translate(120 70)" className="anim-floaty">
        <line x1="-50" y1="10" x2="50" y2="10" stroke={broom} strokeWidth="4" strokeLinecap="round" />
        <g transform="translate(50 10)">
          <path d="M0 0 L20 -8 L20 8 Z" fill={dark ? "#FFD166" : "#D4A574"} />
          <path d="M0 0 L18 -6 L18 6 Z" fill={dark ? "#B794F6" : "#C97B4B"} />
        </g>
        <path d="M-10 -5 Q -15 10 -10 25 L10 25 Q 15 10 10 -5 Z" fill={dress} />
        <circle cx="0" cy="-15" r="14" fill={skin} />
        <path d="M-14 -20 Q -25 -10 -20 5 Q -18 -5 -14 -10 Z" fill={hair} />
        <path d="M14 -20 Q 25 -10 20 5 Q 18 -5 14 -10 Z" fill={hair} />
        <path d="M-14 -20 L0 -45 L14 -20 Z" fill={dark ? "#1A143D" : "#2F3E2E"} />
        <ellipse cx="0" cy="-20" rx="18" ry="3" fill={dark ? "#1A143D" : "#2F3E2E"} />
        <rect x="-10" y="-24" width="20" height="3" fill="#FFD166" />
        <g className="anim-blink" style={{ transformOrigin: "center" }}>
          <ellipse cx="-5" cy="-15" rx="2" ry="2.5" fill="#2F3E2E" />
          <ellipse cx="5" cy="-15" rx="2" ry="2.5" fill="#2F3E2E" />
        </g>
        <path d="M-3 -10 Q 0 -7 3 -10" stroke="#2F3E2E" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <path d="M-10 0 Q -20 8 -25 10" stroke={skin} strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M10 0 Q 20 8 25 10" stroke={skin} strokeWidth="5" fill="none" strokeLinecap="round" />
      </g>
      <g opacity="0.6">
        {[[-30, 75], [-50, 80], [-70, 85]].map(([x, y], i) => (
          <circle key={i} cx={x + 120} cy={y} r="2" fill={dark ? "#FFD166" : "#FFC857"} className="anim-glow" style={{ animationDelay: (i * 0.3) + "s" }} />
        ))}
      </g>
    </svg>
  );
}
