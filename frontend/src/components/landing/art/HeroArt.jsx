import { useTheme } from "../../../context/ThemeContext";

/**
 * HeroArt — the centerpiece magical illustration.
 * A cozy treehouse scene with a girl reading, a rabbit holding a watch,
 * a floating AI companion, a language signpost, mushrooms & flowers.
 * Palette flips between the mystical night (dark) and Ghibli day (light).
 */
export default function HeroArt({ className = "" }) {
  const { dark } = useTheme();

  // Palette
  const skyTop = dark ? "#09071B" : "#DFF4FF";
  const skyBot = dark ? "#1A143D" : "#FFF9EE";
  const moonSun = dark ? "#FFE8A3" : "#FFC857";
  const moonGlow = dark ? "rgba(255,232,163,0.35)" : "rgba(255,200,87,0.4)";
  const hill = dark ? "#160E33" : "#C9F2D3";
  const hill2 = dark ? "#1E1640" : "#B8E8C4";
  const trunk = dark ? "#3D2B5E" : "#8B6F47";
  const trunkDark = dark ? "#2A1F4A" : "#6B5236";
  const canopy = dark ? "#2A1F4A" : "#4CAF7D";
  const canopyLight = dark ? "#3D2B5E" : "#6BCB8A";
  const house = dark ? "#4A3B6E" : "#A88B5E";
  const houseDark = dark ? "#3A2D5A" : "#8B6F47";
  const roof = dark ? "#5B4A8E" : "#C97B4B";
  const window = dark ? "#FFD166" : "#FFE08A";
  const dress = dark ? "#8B5CF6" : "#4CAF7D";
  const dressDark = dark ? "#7C3AED" : "#3D9A6C";
  const hair = dark ? "#3D2B5E" : "#5C3D2E";
  const skin = "#F8D5B5";
  const rabbit = dark ? "#F5F0FF" : "#FFFFFF";
  const rabbitShade = dark ? "#D8D4F2" : "#E8E8F0";
  const blob = dark ? "#8B5CF6" : "#4CAF7D";
  const blobDark = dark ? "#7C3AED" : "#3D9A6C";
  const sign = dark ? "#4A3B6E" : "#8B6F47";
  const signDark = dark ? "#3A2D5A" : "#6B5236";
  const grass = dark ? "#1E1640" : "#4CAF7D";
  const grassLight = dark ? "#2A1F4A" : "#6BCB8A";
  const ground = dark ? "#120B2F" : "#C9F2D3";
  const mushroomCap = "#FF6B9D";
  const mushroomDot = "#FFFFFF";
  const flowerCols = ["#FF8FB1", "#FFC857", "#9DADF0", "#FF6B9D"];

  return (
    <svg
      viewBox="0 0 880 560"
      className={className}
      role="img"
      aria-label="A magical treehouse scene where a child reads with a rabbit and a floating AI companion"
    >
      <defs>
        <linearGradient id="heroSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={skyTop} />
          <stop offset="100%" stopColor={skyBot} />
        </linearGradient>
        <radialGradient id="heroMoon" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={moonSun} />
          <stop offset="80%" stopColor={moonSun} />
          <stop offset="100%" stopColor={moonSun} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="heroMoonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={moonGlow} />
          <stop offset="100%" stopColor={moonGlow} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="heroCanopy" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={canopyLight} />
          <stop offset="100%" stopColor={canopy} />
        </linearGradient>
        <linearGradient id="heroDress" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={dress} />
          <stop offset="100%" stopColor={dressDark} />
        </linearGradient>
        <linearGradient id="heroBlob" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={blob} />
          <stop offset="100%" stopColor={blobDark} />
        </linearGradient>
        <radialGradient id="heroBlobGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={blob} stopOpacity="0.5" />
          <stop offset="100%" stopColor={blob} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="heroGround" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={grass} />
          <stop offset="100%" stopColor={ground} />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="880" height="560" fill="url(#heroSky)" />

      {/* Moon / Sun */}
      <circle cx="150" cy="120" r="120" fill="url(#heroMoonGlow)" className="anim-glow" />
      <circle cx="150" cy="120" r="52" fill="url(#heroMoon)" />
      {dark ? (
        <>
          {/* Moon craters */}
          <circle cx="138" cy="108" r="8" fill={moonSun} opacity="0.5" />
          <circle cx="165" cy="130" r="6" fill={moonSun} opacity="0.4" />
          <circle cx="145" cy="138" r="5" fill={moonSun} opacity="0.4" />
        </>
      ) : (
        <>
          {/* Sun rays */}
          <g className="anim-spin-slow" style={{ transformOrigin: "150px 120px" }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <rect
                key={i}
                x="148"
                y="48"
                width="4"
                height="20"
                rx="2"
                fill={moonSun}
                opacity="0.5"
                transform={`rotate(${i * 30} 150 120)`}
              />
            ))}
          </g>
        </>
      )}

      {/* Stars (dark only) */}
      {dark &&
        [
          [80, 60], [260, 40], [340, 90], [420, 50], [520, 80],
          [600, 45], [680, 95], [760, 55], [820, 110], [300, 150],
          [500, 140], [720, 160], [180, 200], [620, 200],
        ].map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i % 3 === 0 ? 2.2 : 1.4}
            fill="#FFFFFF"
            className="anim-glow"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}

      {/* Distant castle silhouette */}
      <g opacity={dark ? "0.5" : "0.35"}>
        <path
          d="M0 420 L40 420 L40 380 L70 380 L70 400 L100 400 L100 360 L130 360 L130 420 Z"
          fill={dark ? "#1E1640" : "#A8D8B8"}
        />
        <path
          d="M740 420 L740 380 L770 380 L770 400 L800 400 L800 360 L830 360 L830 390 L860 390 L860 420 L740 420 Z"
          fill={dark ? "#1E1640" : "#A8D8B8"}
        />
      </g>

      {/* Hills */}
      <ellipse cx="200" cy="460" rx="280" ry="80" fill={hill2} />
      <ellipse cx="700" cy="470" rx="300" ry="90" fill={hill} />

      {/* Ground */}
      <path d="M0 440 Q 440 400 880 440 L880 560 L0 560 Z" fill="url(#heroGround)" />

      {/* Grass tufts */}
      {[
        [60, 470], [180, 490], [300, 475], [420, 500], [540, 480],
        [660, 495], [780, 475], [120, 510], [360, 520], [600, 515],
      ].map(([x, y], i) => (
        <g key={i} className="anim-sway" style={{ transformOrigin: `${x}px ${y}px`, animationDelay: `${i * 0.4}s` }}>
          <path d={`M${x} ${y} l-6 -16 M${x} ${y} l0 -18 M${x} ${y} l6 -16`} stroke={grassLight} strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
      ))}

      {/* Flowers */}
      {[
        [90, 500, 0], [240, 510, 1], [380, 505, 2], [500, 515, 3],
        [620, 505, 0], [760, 500, 1], [160, 525, 2], [440, 525, 3],
      ].map(([x, y, ci], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <circle cx="0" cy="-8" r="4" fill={flowerCols[ci]} />
          <circle cx="-5" cy="-4" r="4" fill={flowerCols[ci]} />
          <circle cx="5" cy="-4" r="4" fill={flowerCols[ci]} />
          <circle cx="-3" cy="0" r="4" fill={flowerCols[ci]} />
          <circle cx="3" cy="0" r="4" fill={flowerCols[ci]} />
          <circle cx="0" cy="-4" r="2.5" fill={dark ? "#FFD166" : "#FFC857"} />
        </g>
      ))}

      {/* Big tree (right side) */}
      <g>
        {/* Trunk */}
        <path
          d="M680 460 C 670 380 685 300 690 240 L730 240 C 735 300 750 380 740 460 Z"
          fill={trunk}
        />
        <path d="M700 460 C 698 380 705 320 708 250 L720 250 C 723 320 730 380 728 460 Z" fill={trunkDark} opacity="0.5" />

        {/* Branches */}
        <path d="M690 280 C 640 270 600 250 560 240" stroke={trunk} strokeWidth="14" fill="none" strokeLinecap="round" />
        <path d="M730 270 C 780 260 820 240 850 220" stroke={trunk} strokeWidth="12" fill="none" strokeLinecap="round" />

        {/* Canopy blobs */}
        <g className="anim-sway" style={{ transformOrigin: "710px 180px" }}>
          <ellipse cx="710" cy="170" rx="120" ry="100" fill="url(#heroCanopy)" />
          <ellipse cx="640" cy="200" rx="70" ry="60" fill="url(#heroCanopy)" />
          <ellipse cx="780" cy="190" rx="75" ry="65" fill="url(#heroCanopy)" />
          <ellipse cx="700" cy="120" rx="80" ry="55" fill={canopyLight} />
          <ellipse cx="760" cy="140" rx="55" ry="45" fill={canopyLight} />
        </g>

        {/* Treehouse */}
        <g>
          <rect x="660" y="250" width="100" height="70" rx="8" fill={house} />
          <rect x="660" y="250" width="100" height="70" rx="8" fill={houseDark} opacity="0.3" />
          {/* Roof */}
          <path d="M650 255 L710 220 L770 255 Z" fill={roof} />
          <path d="M650 255 L710 220 L710 230 L660 258 Z" fill={houseDark} opacity="0.4" />
          {/* Window */}
          <rect x="685" y="265" width="24" height="24" rx="4" fill={window} className="anim-flicker" />
          <line x1="697" y1="265" x2="697" y2="289" stroke={house} strokeWidth="2" />
          <line x1="685" y1="277" x2="709" y2="277" stroke={house} strokeWidth="2" />
          {/* Door */}
          <rect x="725" y="280" width="20" height="40" rx="4" fill={houseDark} />
          <circle cx="740" cy="300" r="2" fill={window} />
          {/* Lantern hanging */}
          <line x1="600" y1="245" x2="600" y2="275" stroke={trunk} strokeWidth="2" />
          <g className="anim-sway" style={{ transformOrigin: "600px 275px" }}>
            <ellipse cx="600" cy="285" rx="10" ry="13" fill={window} className="anim-flicker" />
            <ellipse cx="600" cy="285" rx="16" ry="18" fill={window} opacity="0.25" />
          </g>
        </g>
      </g>

      {/* Signpost */}
      <g transform="translate(440 380)">
        <rect x="-5" y="0" width="10" height="90" rx="3" fill={sign} />
        <rect x="-5" y="0" width="10" height="90" rx="3" fill={signDark} opacity="0.4" />
        {/* Arrow planks */}
        <g className="anim-sway" style={{ transformOrigin: "0px 10px" }}>
          <path d="M-60 8 L60 8 L70 20 L60 32 L-60 32 L-70 20 Z" fill={sign} />
          <path d="M-60 8 L60 8 L70 20 L60 32 L-60 32 L-70 20 Z" fill={signDark} opacity="0.25" />
          <text x="0" y="24" textAnchor="middle" fontSize="13" fontWeight="700" fill={dark ? "#FFE8A3" : "#FFF"} fontFamily="'Baloo 2', sans-serif">ENGLISH</text>
        </g>
        <g transform="translate(0 40)" className="anim-sway" style={{ transformOrigin: "0px 50px", animationDelay: "0.5s" }}>
          <path d="M-55 8 L55 8 L65 20 L55 32 L-55 32 L-65 20 Z" fill={sign} />
          <path d="M-55 8 L55 8 L65 20 L55 32 L-55 32 L-65 20 Z" fill={signDark} opacity="0.25" />
          <text x="0" y="24" textAnchor="middle" fontSize="13" fontWeight="700" fill={dark ? "#FFE8A3" : "#FFF"} fontFamily="'Baloo 2', sans-serif">ESPAÑOL</text>
        </g>
        <g transform="translate(0 80)" className="anim-sway" style={{ transformOrigin: "0px 90px", animationDelay: "1s" }}>
          <path d="M-50 8 L50 8 L60 20 L50 32 L-50 32 L-60 20 Z" fill={sign} />
          <path d="M-50 8 L50 8 L60 20 L50 32 L-50 32 L-60 20 Z" fill={signDark} opacity="0.25" />
          <text x="0" y="24" textAnchor="middle" fontSize="13" fontWeight="700" fill={dark ? "#FFE8A3" : "#FFF"} fontFamily="'Baloo 2', sans-serif">FRANÇAIS</text>
        </g>
      </g>

      {/* Girl reading (center) */}
      <g transform="translate(280 360)">
        {/* Legs with striped socks */}
        <path d="M-20 80 Q -25 100 -30 120 L-10 120 Q -8 100 -5 80 Z" fill={dressDark} />
        <path d="M5 80 Q 8 100 10 120 L30 120 Q 25 100 20 80 Z" fill={dressDark} />
        {/* Striped socks */}
        {[-28, -22, -16, -10].map((y, i) => (
          <rect key={i} x="-30" y={y + 100} width="20" height="4" fill={i % 2 ? "#FF8FB1" : "#FFFFFF"} opacity="0.8" />
        ))}
        {[10, 16, 22, 28].map((y, i) => (
          <rect key={i} x="10" y={y + 92} width="20" height="4" fill={i % 2 ? "#FF8FB1" : "#FFFFFF"} opacity="0.8" />
        ))}
        {/* Shoes */}
        <ellipse cx="-20" cy="122" rx="14" ry="6" fill="#3D2B5E" />
        <ellipse cx="20" cy="122" rx="14" ry="6" fill="#3D2B5E" />

        {/* Dress / body */}
        <path d="M-30 0 Q -40 40 -35 85 L35 85 Q 40 40 30 0 Z" fill="url(#heroDress)" />
        <path d="M-30 0 Q -40 40 -35 85 L35 85 Q 40 40 30 0 Z" fill={dressDark} opacity="0.15" />

        {/* Arms holding book */}
        <path d="M-30 10 Q -45 25 -40 45" stroke={skin} strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d="M30 10 Q 45 25 40 45" stroke={skin} strokeWidth="10" fill="none" strokeLinecap="round" />

        {/* Open book */}
        <g transform="translate(0 40)">
          <path d="M-40 0 L0 -6 L40 0 L40 18 L0 12 L-40 18 Z" fill="#FFFFFF" />
          <path d="M-40 0 L0 -6 L0 12 L-40 18 Z" fill="#F0F0F0" />
          <line x1="0" y1="-6" x2="0" y2="12" stroke="#CCC" strokeWidth="1" />
          <line x1="-32" y1="4" x2="-8" y2="0" stroke="#BBB" strokeWidth="1.5" />
          <line x1="-32" y1="9" x2="-8" y2="5" stroke="#BBB" strokeWidth="1.5" />
          <line x1="8" y1="0" x2="32" y2="4" stroke="#BBB" strokeWidth="1.5" />
          <line x1="8" y1="5" x2="32" y2="9" stroke="#BBB" strokeWidth="1.5" />
        </g>

        {/* Head */}
        <g className="anim-breathe" style={{ transformOrigin: "0px -30px" }}>
          {/* Hair back */}
          <path d="M-28 -50 Q -35 -20 -30 5 L30 5 Q 35 -20 28 -50 Z" fill={hair} />
          {/* Face */}
          <circle cx="0" cy="-30" r="26" fill={skin} />
          {/* Hair front */}
          <path d="M-26 -48 Q -20 -58 0 -56 Q 20 -58 26 -48 Q 22 -42 0 -44 Q -22 -42 -26 -48 Z" fill={hair} />
          {/* Bow */}
          <path d="M-8 -52 L-16 -48 L-16 -40 L-8 -44 L-8 -52 M8 -52 L16 -48 L16 -40 L8 -44 L8 -52" fill="#FF8FB1" />
          <circle cx="0" cy="-48" r="4" fill="#FF6B9D" />
          {/* Eyes (blink) */}
          <g className="anim-blink" style={{ transformOrigin: "center" }}>
            <ellipse cx="-9" cy="-30" rx="3" ry="4" fill="#2F3E2E" />
            <ellipse cx="9" cy="-30" rx="3" ry="4" fill="#2F3E2E" />
            <circle cx="-8" cy="-31" r="1" fill="#fff" />
            <circle cx="10" cy="-31" r="1" fill="#fff" />
          </g>
          {/* Blush */}
          <circle cx="-14" cy="-22" r="4" fill="#FF8FB1" opacity="0.4" />
          <circle cx="14" cy="-22" r="4" fill="#FF8FB1" opacity="0.4" />
          {/* Smile */}
          <path d="M-5 -20 Q 0 -15 5 -20" stroke="#2F3E2E" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      </g>

      {/* Rabbit (next to girl) */}
      <g transform="translate(180 410)" className="anim-floaty-sm" style={{ animationDelay: "1s" }}>
        {/* Body */}
        <ellipse cx="0" cy="30" rx="22" ry="26" fill={rabbit} />
        <ellipse cx="0" cy="30" rx="22" ry="26" fill={rabbitShade} opacity="0.3" />
        {/* Head */}
        <circle cx="0" cy="-5" r="18" fill={rabbit} />
        {/* Ears */}
        <ellipse cx="-10" cy="-30" rx="5" ry="18" fill={rabbit} />
        <ellipse cx="10" cy="-30" rx="5" ry="18" fill={rabbit} />
        <ellipse cx="-10" cy="-30" rx="2.5" ry="13" fill="#FFB3D1" />
        <ellipse cx="10" cy="-30" rx="2.5" ry="13" fill="#FFB3D1" />
        {/* Eyes */}
        <circle cx="-6" cy="-6" r="2.5" fill="#2F3E2E" />
        <circle cx="6" cy="-6" r="2.5" fill="#2F3E2E" />
        <circle cx="-5" cy="-7" r="0.8" fill="#fff" />
        <circle cx="7" cy="-7" r="0.8" fill="#fff" />
        {/* Nose */}
        <path d="M-3 0 L0 3 L3 0 Z" fill="#FF8FB1" />
        {/* Whiskers */}
        <line x1="-8" y1="2" x2="-18" y2="0" stroke="#999" strokeWidth="0.8" />
        <line x1="-8" y1="4" x2="-18" y2="5" stroke="#999" strokeWidth="0.8" />
        <line x1="8" y1="2" x2="18" y2="0" stroke="#999" strokeWidth="0.8" />
        <line x1="8" y1="4" x2="18" y2="5" stroke="#999" strokeWidth="0.8" />
        {/* Pocket watch */}
        <circle cx="14" cy="25" r="8" fill="#FFD166" />
        <circle cx="14" cy="25" r="6" fill="#FFE8A3" />
        <line x1="14" y1="25" x2="14" y2="20" stroke="#8B6F47" strokeWidth="1.5" />
        <line x1="14" y1="25" x2="18" y2="27" stroke="#8B6F47" strokeWidth="1.5" />
        <circle cx="14" cy="25" r="1" fill="#8B6F47" />
        <line x1="14" y1="17" x2="14" y2="10" stroke="#8B6F47" strokeWidth="1.5" />
      </g>

      {/* AI companion blob (floating) */}
      <g transform="translate(380 250)" className="anim-bob">
        {/* Glow */}
        <circle cx="0" cy="0" r="50" fill="url(#heroBlobGlow)" className="anim-glow" />
        {/* Body */}
        <path
          d="M-30 -10 C -35 -30 -20 -40 0 -38 C 20 -40 35 -30 30 -10 C 38 5 35 25 20 30 C 10 34 -10 34 -20 30 C -35 25 -38 5 -30 -10 Z"
          fill="url(#heroBlob)"
        />
        <path
          d="M-30 -10 C -35 -30 -20 -40 0 -38 C 20 -40 35 -30 30 -10 C 38 5 35 25 20 30 C 10 34 -10 34 -20 30 C -35 25 -38 5 -30 -10 Z"
          fill={blobDark}
          opacity="0.2"
        />
        {/* Eyes */}
        <g className="anim-blink" style={{ transformOrigin: "center" }}>
          <ellipse cx="-10" cy="-5" rx="4" ry="6" fill="#fff" />
          <ellipse cx="10" cy="-5" rx="4" ry="6" fill="#fff" />
          <circle cx="-10" cy="-3" r="2.5" fill="#2F3E2E" />
          <circle cx="10" cy="-3" r="2.5" fill="#2F3E2E" />
          <circle cx="-9" cy="-4" r="1" fill="#fff" />
          <circle cx="11" cy="-4" r="1" fill="#fff" />
        </g>
        {/* Smile */}
        <path d="M-8 8 Q 0 14 8 8" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Cheek glow */}
        <circle cx="-16" cy="5" r="4" fill="#fff" opacity="0.3" />
        <circle cx="16" cy="5" r="4" fill="#fff" opacity="0.3" />
        {/* Little antenna star */}
        <line x1="0" y1="-38" x2="0" y2="-48" stroke={blob} strokeWidth="2" strokeLinecap="round" />
        <path d="M0 -52 L2 -47 L7 -46 L3 -43 L4 -38 L0 -41 L-4 -38 L-3 -43 L-7 -46 L-2 -47 Z" fill={dark ? "#FFD166" : "#FFC857"} className="anim-glow" />
      </g>

      {/* Mushrooms */}
      <g transform="translate(120 470)">
        <rect x="-4" y="-2" width="8" height="20" rx="3" fill="#FFF5E0" />
        <path d="M-16 -2 Q -16 -16 0 -16 Q 16 -16 16 -2 Z" fill={mushroomCap} />
        <circle cx="-7" cy="-8" r="2.5" fill={mushroomDot} />
        <circle cx="4" cy="-10" r="2" fill={mushroomDot} />
        <circle cx="9" cy="-5" r="1.5" fill={mushroomDot} />
      </g>
      <g transform="translate(560 485) scale(0.8)">
        <rect x="-4" y="-2" width="8" height="20" rx="3" fill="#FFF5E0" />
        <path d="M-16 -2 Q -16 -16 0 -16 Q 16 -16 16 -2 Z" fill={mushroomCap} />
        <circle cx="-7" cy="-8" r="2.5" fill={mushroomDot} />
        <circle cx="4" cy="-10" r="2" fill={mushroomDot} />
      </g>

      {/* Floating books */}
      <g transform="translate(500 200) rotate(-12)" className="anim-floaty" style={{ animationDelay: "0.5s" }}>
        <rect x="-18" y="-14" width="36" height="28" rx="3" fill={dark ? "#B794F6" : "#9DADF0"} />
        <rect x="-18" y="-14" width="6" height="28" rx="3" fill="rgba(0,0,0,0.2)" />
        <line x1="-6" y1="-6" x2="12" y2="-6" stroke="#fff" strokeWidth="1.5" opacity="0.6" />
        <line x1="-6" y1="0" x2="10" y2="0" stroke="#fff" strokeWidth="1.5" opacity="0.4" />
      </g>
      <g transform="translate(620 160) rotate(15)" className="anim-floaty-sm" style={{ animationDelay: "1.5s" }}>
        <rect x="-15" y="-12" width="30" height="24" rx="3" fill={dark ? "#FFD166" : "#FFC857"} />
        <rect x="-15" y="-12" width="5" height="24" rx="3" fill="rgba(0,0,0,0.2)" />
      </g>
    </svg>
  );
}