import { useTheme } from "../../../context/ThemeContext";

export default function AssistantArt({ className = "" }) {
  const { dark } = useTheme();
  const bg = dark ? "#120B2F" : "#FFF3DC";
  const bg2 = dark ? "#1A143D" : "#FFF9EE";
  const desk = dark ? "#3A2D5A" : "#8B6F47";
  const deskD = dark ? "#2A1F4A" : "#6B5236";
  const dress = dark ? "#8B5CF6" : "#4CAF7D";
  const hair = dark ? "#3D2B5E" : "#5C3D2E";
  const skin = "#F8D5B5";
  const blob = dark ? "#8B5CF6" : "#4CAF7D";
  const blobD = dark ? "#7C3AED" : "#3D9A6C";
  const bubble = dark ? "#1A143D" : "#FFFFFF";
  const bubbleBorder = dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)";
  const win = dark ? "#FFD166" : "#FFE08A";

  return (
    <svg viewBox="0 0 480 360" className={className} role="img" aria-label="A child learning with an AI assistant">
      <defs>
        <linearGradient id="asBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={bg} />
          <stop offset="100%" stopColor={bg2} />
        </linearGradient>
        <radialGradient id="asGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={blob} stopOpacity="0.4" />
          <stop offset="100%" stopColor={blob} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="asBlob" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={blob} />
          <stop offset="100%" stopColor={blobD} />
        </linearGradient>
      </defs>
      <rect width="480" height="360" fill="url(#asBg)" rx="24" />
      {dark
        ? [[40, 40], [120, 25], [380, 35], [440, 60], [200, 20], [320, 50]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="1.5" fill="#fff" className="anim-glow" style={{ animationDelay: `${i * 0.3}s` }} />
          ))
        : [[60, 40, "#FF8FB1"], [420, 50, "#9DADF0"], [150, 25, "#FFC857"], [350, 30, "#4CAF7D"]].map(([x, y, c], i) => (
            <g key={i} transform={`translate(${x} ${y})`} className="anim-floaty-sm" style={{ animationDelay: `${i * 0.5}s` }}>
              <path d="M0 -5 L1.2 -1.2 L5 0 L1.2 1.2 L0 5 L-1.2 1.2 L-5 0 L-1.2 -1.2 Z" fill={c} />
            </g>
          ))}
      <rect x="30" y="40" width="90" height="80" rx="8" fill={dark ? "#09071B" : "#DFF4FF"} opacity="0.7" />
      <line x1="75" y1="40" x2="75" y2="120" stroke={deskD} strokeWidth="3" />
      <line x1="30" y1="80" x2="120" y2="80" stroke={deskD} strokeWidth="3" />
      <rect x="95" y="118" width="16" height="14" fill={deskD} />
      <g className="anim-sway" style={{ transformOrigin: "103px 118px" }}>
        <ellipse cx="103" cy="112" rx="10" ry="8" fill={dark ? "#2A1F4A" : "#4CAF7D"} />
        <ellipse cx="96" cy="108" rx="6" ry="5" fill={dark ? "#3A2D5A" : "#6BCB8A"} />
        <ellipse cx="110" cy="108" rx="6" ry="5" fill={dark ? "#3A2D5A" : "#6BCB8A"} />
      </g>
      <rect x="60" y="250" width="360" height="14" rx="4" fill={desk} />
      <rect x="80" y="264" width="10" height="80" fill={deskD} />
      <rect x="390" y="264" width="10" height="80" fill={deskD} />
      <g transform="translate(180 200)">
        <path d="M-28 0 Q -38 25 -32 50 L32 50 Q 38 25 28 0 Z" fill={dress} />
        <path d="M-28 0 Q -38 25 -32 50 L32 50 Q 38 25 28 0 Z" fill={blobD} opacity="0.15" />
        <path d="M-28 15 Q -40 35 -32 52" stroke={skin} strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M28 15 Q 40 35 32 52" stroke={skin} strokeWidth="9" fill="none" strokeLinecap="round" />
        <g className="anim-breathe" style={{ transformOrigin: "0px -25px" }}>
          <path d="M-26 -45 Q -32 -15 -28 5 L28 5 Q 32 -15 26 -45 Z" fill={hair} />
          <circle cx="0" cy="-25" r="24" fill={skin} />
          <path d="M-24 -42 Q -14 -50 0 -48 Q 14 -50 24 -42 Q 20 -36 0 -38 Q -20 -36 -24 -42 Z" fill={hair} />
          <path d="M-10 -46 L-18 -42 L-18 -34 L-10 -38 Z M10 -46 L18 -42 L18 -34 L10 -38 Z" fill="#FF8FB1" />
          <circle cx="0" cy="-42" r="4" fill="#FF6B9D" />
          <g className="anim-blink" style={{ transformOrigin: "center" }}>
            <ellipse cx="-8" cy="-25" rx="3" ry="4" fill="#2F3E2E" />
            <ellipse cx="8" cy="-25" rx="3" ry="4" fill="#2F3E2E" />
            <circle cx="-7" cy="-26" r="1" fill="#fff" />
            <circle cx="9" cy="-26" r="1" fill="#fff" />
          </g>
          <circle cx="-13" cy="-18" r="4" fill="#FF8FB1" opacity="0.4" />
          <circle cx="13" cy="-18" r="4" fill="#FF8FB1" opacity="0.4" />
          <path d="M-4 -14 Q 0 -9 4 -14" stroke="#2F3E2E" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      </g>
      <g transform="translate(180 248)">
        <path d="M-40 0 L0 -6 L40 0 L40 14 L0 8 L-40 14 Z" fill="#fff" />
        <path d="M-40 0 L0 -6 L0 8 L-40 14 Z" fill="#F0F0F0" />
        <line x1="0" y1="-6" x2="0" y2="8" stroke="#CCC" strokeWidth="1" />
        <line x1="-30" y1="4" x2="-8" y2="0" stroke="#BBB" strokeWidth="1.5" />
        <line x1="-30" y1="8" x2="-8" y2="4" stroke="#BBB" strokeWidth="1.5" />
        <line x1="8" y1="0" x2="30" y2="4" stroke="#BBB" strokeWidth="1.5" />
        <line x1="8" y1="4" x2="30" y2="8" stroke="#BBB" strokeWidth="1.5" />
      </g>
      <g transform="translate(350 160)" className="anim-bob">
        <circle cx="0" cy="0" r="70" fill="url(#asGlow)" className="anim-glow" />
        <path d="M-40 -15 C -48 -42 -25 -55 0 -52 C 25 -55 48 -42 40 -15 C 52 8 46 35 28 42 C 14 48 -14 48 -28 42 C -46 35 -52 8 -40 -15 Z" fill="url(#asBlob)" />
        <path d="M-40 -15 C -48 -42 -25 -55 0 -52 C 25 -55 48 -42 40 -15 C 52 8 46 35 28 42 C 14 48 -14 48 -28 42 C -46 35 -52 8 -40 -15 Z" fill={blobD} opacity="0.2" />
        <g className="anim-blink" style={{ transformOrigin: "center" }}>
          <ellipse cx="-13" cy="-8" rx="5" ry="7" fill="#fff" />
          <ellipse cx="13" cy="-8" rx="5" ry="7" fill="#fff" />
          <circle cx="-13" cy="-6" r="3" fill="#2F3E2E" />
          <circle cx="13" cy="-6" r="3" fill="#2F3E2E" />
          <circle cx="-11" cy="-8" r="1.2" fill="#fff" />
          <circle cx="15" cy="-8" r="1.2" fill="#fff" />
        </g>
        <path d="M-10 10 Q 0 18 10 10" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="-22" cy="6" r="5" fill="#fff" opacity="0.3" />
        <circle cx="22" cy="6" r="5" fill="#fff" opacity="0.3" />
        <line x1="0" y1="-52" x2="0" y2="-65" stroke={blob} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M0 -70 L2.5 -63 L9 -62 L4 -58 L5 -51 L0 -55 L-5 -51 L-4 -58 L-9 -62 L-2.5 -63 Z" fill={dark ? "#FFD166" : "#FFC857"} className="anim-glow" />
      </g>
      <g transform="translate(260 120)">
        <rect x="0" y="0" width="120" height="32" rx="16" fill={bubble} stroke={bubbleBorder} strokeWidth="1" className="anim-floaty-sm" />
        <circle cx="16" cy="16" r="4" fill={blob} />
        <rect x="26" y="12" width="60" height="3" rx="1.5" fill={dark ? "#D8D4F2" : "#CCC"} />
        <rect x="26" y="19" width="40" height="3" rx="1.5" fill={dark ? "#D8D4F2" : "#DDD"} />
        <path d="M8 28 L4 36 L14 30 Z" fill={bubble} />
      </g>
      <g transform="translate(270 165)">
        <rect x="0" y="0" width="100" height="28" rx="14" fill={blob} opacity="0.9" className="anim-floaty-sm" style={{ animationDelay: "0.5s" }} />
        <rect x="14" y="10" width="50" height="3" rx="1.5" fill="#fff" opacity="0.7" />
        <rect x="14" y="16" width="35" height="3" rx="1.5" fill="#fff" opacity="0.5" />
        <path d="M92 22 L98 30 L88 26 Z" fill={blob} opacity="0.9" />
      </g>
      <g transform="translate(330 230)">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <rect key={i} x={i * 8} y="-12" width="4" height="24" rx="2" fill={dark ? "#FFD166" : "#FFC857"} style={{ transformOrigin: "center", animation: `mg-wave-bar 0.8s ease-in-out infinite`, animationDelay: `${i * 0.1}s` }} />
        ))}
      </g>
      <g transform="translate(100 240)">
        <line x1="0" y1="-20" x2="0" y2="0" stroke={deskD} strokeWidth="2" />
        <ellipse cx="0" cy="6" rx="10" ry="12" fill={win} className="anim-flicker" />
        <ellipse cx="0" cy="6" rx="16" ry="18" fill={win} opacity="0.2" />
      </g>
    </svg>
  );
}