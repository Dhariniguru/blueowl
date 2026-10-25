import { useMemo } from "react";

const rand = (min, max) => Math.random() * (max - min) + min;

/* ---------- Stars (dark theme) ---------- */
export function StarField({ count = 70, className = "" }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        x: rand(0, 100),
        y: rand(0, 100),
        s: rand(1, 2.6),
        dur: rand(2, 5),
        delay: rand(0, 5),
      })),
    [count]
  );
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {stars.map((st, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${st.x}%`,
            top: `${st.y}%`,
            width: `${st.s}px`,
            height: `${st.s}px`,
            background: "var(--mg-star)",
            boxShadow: "0 0 6px var(--mg-star)",
            animation: `mg-twinkle ${st.dur}s ease-in-out infinite`,
            animationDelay: `${st.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ---------- Fireflies (dark theme) ---------- */
export function Fireflies({ count = 22, className = "" }) {
  const flies = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        x: rand(0, 100),
        y: rand(20, 95),
        s: rand(3, 6),
        dur: rand(5, 9),
        delay: rand(0, 6),
      })),
    [count]
  );
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {flies.map((f, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            width: `${f.s}px`,
            height: `${f.s}px`,
            background: "var(--mg-gold)",
            boxShadow: "0 0 10px 2px var(--mg-gold)",
            animation: `mg-floaty ${f.dur}s ease-in-out infinite`,
            animationDelay: `${f.delay}s`,
            opacity: 0.8,
          }}
        />
      ))}
    </div>
  );
}

/* ---------- Sparkles ---------- */
export function Sparkles({ count = 14, className = "" }) {
  const sparks = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        x: rand(0, 100),
        y: rand(0, 100),
        s: rand(8, 16),
        dur: rand(2.5, 5),
        delay: rand(0, 4),
      })),
    [count]
  );
  const Spark = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 0 L13.8 9.2 L23 11 L13.8 12.8 L12 22 L10.2 12.8 L1 11 L10.2 9.2 Z"
        fill="var(--mg-gold)"
      />
    </svg>
  );
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {sparks.map((sp, i) => (
        <span
          key={i}
          className="absolute"
          style={{
            left: `${sp.x}%`,
            top: `${sp.y}%`,
            animation: `mg-sparkle ${sp.dur}s ease-in-out infinite`,
            animationDelay: `${sp.delay}s`,
          }}
        >
          <Spark size={sp.s} />
        </span>
      ))}
    </div>
  );
}

/* ---------- Aurora blobs ---------- */
export function Aurora({ className = "" }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div
        className="absolute rounded-full anim-glow"
        style={{
          width: "55vw",
          height: "55vw",
          left: "-10vw",
          top: "-15vh",
          background: "radial-gradient(circle, var(--mg-aurora1), transparent 65%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute rounded-full anim-glow"
        style={{
          width: "50vw",
          height: "50vw",
          right: "-12vw",
          top: "10vh",
          background: "radial-gradient(circle, var(--mg-aurora2), transparent 65%)",
          filter: "blur(45px)",
          animationDelay: "1.5s",
        }}
      />
      <div
        className="absolute rounded-full anim-glow"
        style={{
          width: "45vw",
          height: "45vw",
          left: "30vw",
          bottom: "-20vh",
          background: "radial-gradient(circle, var(--mg-aurora1), transparent 65%)",
          filter: "blur(50px)",
          animationDelay: "3s",
        }}
      />
    </div>
  );
}

/* ---------- Clouds (light theme) ---------- */
export function Clouds({ count = 5, className = "" }) {
  const clouds = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        y: rand(4, 40),
        s: rand(0.7, 1.4),
        dur: rand(40, 80),
        delay: rand(0, 40),
        opacity: rand(0.5, 0.9),
      })),
    [count]
  );
  const Cloud = ({ size }) => (
    <svg width={160 * size} height={70 * size} viewBox="0 0 160 70" fill="none">
      <ellipse cx="40" cy="45" rx="38" ry="22" fill="#fff" />
      <ellipse cx="80" cy="38" rx="44" ry="28" fill="#fff" />
      <ellipse cx="120" cy="46" rx="34" ry="20" fill="#fff" />
      <ellipse cx="100" cy="55" rx="50" ry="14" fill="#fff" />
    </svg>
  );
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {clouds.map((c, i) => (
        <span
          key={i}
          className="absolute"
          style={{
            top: `${c.y}%`,
            left: 0,
            opacity: c.opacity,
            animation: `mg-drift ${c.dur}s linear infinite`,
            animationDelay: `-${c.delay}s`,
          }}
        >
          <Cloud size={c.s} />
        </span>
      ))}
    </div>
  );
}

/* ---------- Butterflies (light theme) ---------- */
export function Butterflies({ count = 6, className = "" }) {
  const flies = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        x: rand(5, 90),
        y: rand(20, 80),
        s: rand(0.6, 1.1),
        dur: rand(6, 11),
        delay: rand(0, 6),
        hue: rand(0, 3),
      })),
    [count]
  );
  const colors = ["#FF8FB1", "#FFC857", "#9DADF0", "#4CAF7D"];
  const Butterfly = ({ size, color }) => (
    <svg width={36 * size} height={30 * size} viewBox="0 0 36 30" fill="none">
      <g style={{ transformOrigin: "18px 15px", animation: "mg-wing 0.18s ease-in-out infinite" }}>
        <ellipse cx="11" cy="10" rx="9" ry="8" fill={color} opacity="0.9" />
        <ellipse cx="11" cy="20" rx="7" ry="6" fill={color} opacity="0.8" />
        <ellipse cx="25" cy="10" rx="9" ry="8" fill={color} opacity="0.9" />
        <ellipse cx="25" cy="20" rx="7" ry="6" fill={color} opacity="0.8" />
      </g>
      <rect x="17" y="6" width="2" height="18" rx="1" fill="#2F3E2E" />
    </svg>
  );
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {flies.map((f, i) => (
        <span
          key={i}
          className="absolute"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            animation: `mg-butterfly ${f.dur}s ease-in-out infinite`,
            animationDelay: `${f.delay}s`,
          }}
        >
          <Butterfly size={f.s} color={colors[Math.floor(f.hue)]} />
        </span>
      ))}
    </div>
  );
}

/* ---------- Floating books ---------- */
export function FloatingBooks({ count = 5, className = "" }) {
  const books = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        x: rand(5, 90),
        y: rand(10, 70),
        s: rand(0.5, 0.9),
        dur: rand(5, 8),
        delay: rand(0, 5),
        rot: rand(-20, 20),
        hue: rand(0, 4),
      })),
    [count]
  );
  const colors = ["#8B5CF6", "#FFC857", "#4CAF7D", "#FF8FB1"];
  const Book = ({ size, color }) => (
    <svg width={40 * size} height={32 * size} viewBox="0 0 40 32" fill="none">
      <rect x="4" y="4" width="32" height="24" rx="3" fill={color} />
      <rect x="4" y="4" width="6" height="24" rx="3" fill="rgba(0,0,0,0.18)" />
      <rect x="14" y="10" width="16" height="2" rx="1" fill="rgba(255,255,255,0.6)" />
      <rect x="14" y="16" width="12" height="2" rx="1" fill="rgba(255,255,255,0.4)" />
    </svg>
  );
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {books.map((b, i) => (
        <span
          key={i}
          className="absolute"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            transform: `rotate(${b.rot}deg)`,
            animation: `mg-floaty ${b.dur}s ease-in-out infinite`,
            animationDelay: `${b.delay}s`,
          }}
        >
          <Book size={b.s} color={colors[Math.floor(b.hue)]} />
        </span>
      ))}
    </div>
  );
}