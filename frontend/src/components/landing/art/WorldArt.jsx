import { useTheme } from "../../../context/ThemeContext";

export default function WorldArt({ lang, className = "" }) {
  const { dark } = useTheme();
  const scenes = {
    english: <EnglishWorld dark={dark} />,
    spanish: <SpanishWorld dark={dark} />,
    french: <FrenchWorld dark={dark} />,
    japanese: <JapaneseWorld dark={dark} />,
    korean: <KoreanWorld dark={dark} />,
  };
  return (
    <svg viewBox="0 0 320 200" className={className} role="img" aria-label={`${lang} language world`}>
      {scenes[lang] || scenes.english}
    </svg>
  );
}

function EnglishWorld({ dark }) {
  const skyT = dark ? "#1A143D" : "#DFF4FF";
  const skyB = dark ? "#2A1F4A" : "#FFF9EE";
  const grass = dark ? "#1E1640" : "#4CAF7D";
  const grassL = dark ? "#2A1F4A" : "#6BCB8A";
  const wall = dark ? "#4A3B6E" : "#F5E6D3";
  const roof = dark ? "#5B4A8E" : "#8B6F47";
  const door = dark ? "#3A2D5A" : "#6B5236";
  const win = dark ? "#FFD166" : "#FFE08A";
  return (
    <>
      <defs>
        <linearGradient id="enSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={skyT} />
          <stop offset="100%" stopColor={skyB} />
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill="url(#enSky)" rx="16" />
      {dark && [[40, 30], [120, 20], [260, 40], [200, 50]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.5" fill="#fff" className="anim-glow" style={{ animationDelay: `${i * 0.5}s` }} />
      ))}
      {!dark && (
        <g>
          <ellipse cx="60" cy="40" rx="30" ry="14" fill="#fff" opacity="0.8" />
          <ellipse cx="250" cy="50" rx="35" ry="16" fill="#fff" opacity="0.7" />
        </g>
      )}
      <path d="M0 150 Q 160 130 320 150 L320 200 L0 200 Z" fill={grass} />
      <ellipse cx="160" cy="155" rx="200" ry="20" fill={grassL} opacity="0.5" />
      <g transform="translate(160 110)">
        <rect x="-40" y="-10" width="80" height="50" rx="4" fill={wall} />
        <path d="M-50 -10 L0 -50 L50 -10 Z" fill={roof} />
        <rect x="-12" y="10" width="24" height="30" rx="3" fill={door} />
        <circle cx="6" cy="25" r="2" fill={win} />
        <rect x="-35" y="0" width="16" height="16" rx="2" fill={win} className="anim-flicker" />
        <rect x="19" y="0" width="16" height="16" rx="2" fill={win} className="anim-flicker" />
        <rect x="20" y="-40" width="10" height="20" fill={roof} />
        {dark && <ellipse cx="25" cy="-45" rx="8" ry="4" fill="#fff" opacity="0.2" />}
      </g>
      {[[80, 165, "#FF8FB1"], [100, 170, "#FFC857"], [220, 168, "#FF8FB1"], [240, 172, "#9DADF0"]].map(([x, y, c], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <circle cx="0" cy="-4" r="3" fill={c} />
          <circle cx="-3" cy="-1" r="3" fill={c} />
          <circle cx="3" cy="-1" r="3" fill={c} />
          <circle cx="0" cy="-1" r="2" fill={dark ? "#FFD166" : "#FFC857"} />
        </g>
      ))}
    </>
  );
}

function SpanishWorld({ dark }) {
  const skyT = dark ? "#1A143D" : "#FFE8C8";
  const skyB = dark ? "#2A1F4A" : "#FFF9EE";
  const ground = dark ? "#1E1640" : "#E8A87C";
  const b1 = dark ? "#3A2D5A" : "#E8A87C";
  const b2 = dark ? "#4A3B6E" : "#C97B4B";
  const b3 = dark ? "#2A1F4A" : "#D4A574";
  const win = dark ? "#FFD166" : "#FFE08A";
  return (
    <>
      <defs>
        <linearGradient id="esSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={skyT} />
          <stop offset="100%" stopColor={skyB} />
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill="url(#esSky)" rx="16" />
      <circle cx="270" cy="40" r="22" fill={dark ? "#FFD166" : "#FFC857"} className="anim-glow" />
      <rect x="0" y="160" width="320" height="40" fill={ground} />
      <g transform="translate(40 60)">
        <rect x="0" y="0" width="60" height="100" fill={b1} />
        <rect x="0" y="0" width="60" height="10" fill={b2} />
        <rect x="8" y="20" width="14" height="14" rx="2" fill={win} className="anim-flicker" />
        <rect x="38" y="20" width="14" height="14" rx="2" fill={win} className="anim-flicker" />
        <rect x="8" y="50" width="14" height="14" rx="2" fill={win} />
        <rect x="38" y="50" width="14" height="14" rx="2" fill={win} />
      </g>
      <g transform="translate(120 40)">
        <rect x="0" y="0" width="70" height="120" fill={b2} />
        <rect x="0" y="0" width="70" height="10" fill={b3} />
        <rect x="10" y="20" width="16" height="20" rx="3" fill={win} className="anim-flicker" />
        <rect x="44" y="20" width="16" height="20" rx="3" fill={win} className="anim-flicker" />
        <rect x="10" y="55" width="16" height="20" rx="3" fill={win} />
        <rect x="44" y="55" width="16" height="20" rx="3" fill={win} />
        <rect x="10" y="90" width="50" height="4" fill={b3} />
        <rect x="10" y="90" width="4" height="20" fill={b3} />
        <rect x="56" y="90" width="4" height="20" fill={b3} />
      </g>
      <g transform="translate(210 70)">
        <rect x="0" y="0" width="60" height="90" fill={b3} />
        <rect x="0" y="0" width="60" height="10" fill={b1} />
        <rect x="8" y="20" width="14" height="14" rx="2" fill={win} className="anim-flicker" />
        <rect x="38" y="20" width="14" height="14" rx="2" fill={win} />
      </g>
      <g transform="translate(160 150) rotate(-15)" className="anim-sway" style={{ transformOrigin: "160px 150px" }}>
        <ellipse cx="0" cy="10" rx="14" ry="18" fill="#C97B4B" />
        <rect x="-5" y="-15" width="10" height="20" rx="3" fill="#C97B4B" />
        <circle cx="0" cy="10" r="5" fill="#6B5236" />
      </g>
    </>
  );
}

function FrenchWorld({ dark }) {
  const skyT = dark ? "#1A143D" : "#E8D5F5";
  const skyB = dark ? "#2A1F4A" : "#FFF9EE";
  const ground = dark ? "#1E1640" : "#C9F2D3";
  const tower = dark ? "#5B4A8E" : "#8B6F47";
  return (
    <>
      <defs>
        <linearGradient id="frSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={skyT} />
          <stop offset="100%" stopColor={skyB} />
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill="url(#frSky)" rx="16" />
      {dark && [[50, 30], [100, 20], [250, 35], [280, 60]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.5" fill="#fff" className="anim-glow" style={{ animationDelay: `${i * 0.4}s` }} />
      ))}
      <path d="M0 160 Q 160 145 320 160 L320 200 L0 200 Z" fill={ground} />
      <g transform="translate(160 160)" fill={tower}>
        <path d="M-4 0 L-30 -80 L-20 -80 L-8 -40 L8 -40 L20 -80 L30 -80 L4 0 Z" />
        <path d="M-8 -40 L-16 -60 L-12 -60 L-6 -45 L6 -45 L12 -60 L16 -60 L8 -40 Z" />
        <rect x="-3" y="-90" width="6" height="15" />
        <path d="M-2 -95 L0 -105 L2 -95 Z" />
        <path d="M-20 -80 Q -12 -70 0 -75 Q 12 -70 20 -80" stroke={tower} strokeWidth="2" fill="none" />
      </g>
      {!dark && (
        <g>
          <ellipse cx="60" cy="50" rx="25" ry="10" fill="#fff" opacity="0.7" />
          <ellipse cx="250" cy="45" rx="28" ry="12" fill="#fff" opacity="0.6" />
        </g>
      )}
      <g transform="translate(50 165)">
        <path d="M-12 0 Q -12 -10 0 -12 Q 12 -10 12 0 Q 8 -4 0 -4 Q -8 -4 -12 0 Z" fill={dark ? "#FFD166" : "#D4A574"} />
      </g>
      <g transform="translate(270 155)">
        <rect x="-2" y="-10" width="4" height="15" fill="#6B5236" />
        <circle cx="0" cy="-15" r="12" fill={dark ? "#2A1F4A" : "#4CAF7D"} />
      </g>
    </>
  );
}

function JapaneseWorld({ dark }) {
  const skyT = dark ? "#1A143D" : "#FFD9E8";
  const skyB = dark ? "#2A1F4A" : "#FFF9EE";
  const ground = dark ? "#1E1640" : "#C9F2D3";
  const pagoda = dark ? "#4A3B6E" : "#C97B4B";
  const pagodaD = dark ? "#3A2D5A" : "#A86843";
  const fuji = dark ? "#2A1F4A" : "#B8D4E8";
  return (
    <>
      <defs>
        <linearGradient id="jpSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={skyT} />
          <stop offset="100%" stopColor={skyB} />
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill="url(#jpSky)" rx="16" />
      <path d="M0 160 L100 80 L160 120 L220 80 L320 160 Z" fill={fuji} opacity="0.6" />
      <path d="M80 100 L100 80 L120 100 L110 95 L100 90 L90 98 Z" fill="#fff" opacity="0.5" />
      <path d="M0 160 Q 160 145 320 160 L320 200 L0 200 Z" fill={ground} />
      <g transform="translate(160 160)">
        <rect x="-25" y="-20" width="50" height="20" fill={pagoda} />
        <path d="M-35 -20 L0 -35 L35 -20 Z" fill={pagodaD} />
        <rect x="-18" y="-45" width="36" height="15" fill={pagoda} />
        <path d="M-28 -45 L0 -58 L28 -45 Z" fill={pagodaD} />
        <rect x="-12" y="-65" width="24" height="12" fill={pagoda} />
        <path d="M-20 -65 L0 -76 L20 -65 Z" fill={pagodaD} />
        <rect x="-3" y="-85" width="6" height="12" fill={pagodaD} />
        <circle cx="0" cy="-88" r="3" fill={dark ? "#FFD166" : "#FFC857"} className="anim-glow" />
      </g>
      {[[40, 40], [80, 70], [250, 50], [280, 90], [120, 100], [220, 30]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`} className="anim-floaty-sm" style={{ animationDelay: `${i * 0.6}s` }}>
          {[0, 72, 144, 216, 288].map((a, j) => (
            <ellipse key={j} cx="0" cy="-3" rx="2" ry="4" fill="#FFB3D1" transform={`rotate(${a})`} />
          ))}
          <circle cx="0" cy="0" r="1.5" fill="#FF8FB1" />
        </g>
      ))}
    </>
  );
}

function KoreanWorld({ dark }) {
  const skyT = dark ? "#1A143D" : "#DFF4FF";
  const skyB = dark ? "#2A1F4A" : "#FFF9EE";
  const ground = dark ? "#1E1640" : "#C9F2D3";
  const palace = dark ? "#4A3B6E" : "#D4A574";
  const palaceD = dark ? "#3A2D5A" : "#B8895A";
  const roof = dark ? "#5B4A8E" : "#4A6B7A";
  const mountain = dark ? "#160E33" : "#8BAFC9";
  return (
    <>
      <defs>
        <linearGradient id="krSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={skyT} />
          <stop offset="100%" stopColor={skyB} />
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill="url(#krSky)" rx="16" />
      <path d="M0 130 L60 70 L120 110 L180 60 L240 100 L320 80 L320 160 L0 160 Z" fill={mountain} opacity="0.5" />
      <path d="M0 155 Q 160 140 320 155 L320 200 L0 200 Z" fill={ground} />
      <g transform="translate(160 155)">
        <rect x="-40" y="-30" width="80" height="30" fill={palace} />
        <path d="M-55 -30 Q -50 -55 0 -55 Q 50 -55 55 -30 L45 -30 Q 40 -45 0 -45 Q -40 -45 -45 -30 Z" fill={roof} />
        <path d="M-55 -30 L-50 -25 L50 -25 L55 -30 Z" fill={palaceD} />
        <rect x="-35" y="-30" width="4" height="30" fill={palaceD} />
        <rect x="-15" y="-30" width="4" height="30" fill={palaceD} />
        <rect x="11" y="-30" width="4" height="30" fill={palaceD} />
        <rect x="31" y="-30" width="4" height="30" fill={palaceD} />
        <rect x="-8" y="-20" width="16" height="20" fill={palaceD} />
        <path d="M-55 -30 Q -60 -20 -50 -15 L-40 -20 Z" fill={roof} />
        <path d="M55 -30 Q 60 -20 50 -15 L40 -20 Z" fill={roof} />
      </g>
      <g transform="translate(60 100)">
        <line x1="0" y1="0" x2="0" y2="15" stroke="#999" strokeWidth="1" />
        <ellipse cx="0" cy="22" rx="8" ry="10" fill={dark ? "#FF6B9D" : "#FF8FB1"} className="anim-flicker" />
        <rect x="-6" y="14" width="12" height="3" fill={palaceD} />
        <rect x="-6" y="30" width="12" height="3" fill={palaceD} />
      </g>
      <g transform="translate(260 95)">
        <line x1="0" y1="0" x2="0" y2="15" stroke="#999" strokeWidth="1" />
        <ellipse cx="0" cy="22" rx="8" ry="10" fill={dark ? "#FFD166" : "#FFC857"} className="anim-flicker" />
        <rect x="-6" y="14" width="12" height="3" fill={palaceD} />
        <rect x="-6" y="30" width="12" height="3" fill={palaceD} />
      </g>
    </>
  );
}