import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { to: "/learning-path", label: "Adventure Map", icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" },
  { to: "/pronunciation", label: "Pronunciation", icon: "M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" },
  { to: "/progress", label: "Progress", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { to: "/achievements", label: "Achievements", icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" },
];

function NavIcon({ path }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 flex flex-col py-5 px-4 transition-all duration-300" style={{ background: "var(--mg-bg)", borderRight: "1px solid var(--mg-border)" }}>
       {/* Logo */}
       <div className="flex items-center gap-2.5 px-2 mb-6">
         <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md" style={{ background: "linear-gradient(135deg, var(--mg-accent), var(--mg-accent-strong))", boxShadow: "0 4px 12px -2px var(--mg-glow)" }}>
           <Sparkles className="w-5 h-5" />
         </div>
         <span className="font-display font-extrabold text-xl text-ink-light dark:text-ink-dark tracking-tight">neo<span className="text-primary-500">+</span> learning</span>
       </div>

       {/* User card */}
       <div className="rounded-2xl p-5 mb-5" style={{ background: "var(--mg-glass)", border: "1px solid var(--mg-border)", backdropFilter: "blur(20px)" }}>
         <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-lg" style={{ background: "linear-gradient(135deg, var(--mg-accent), var(--mg-accent-strong))", color: "white" }}>
             {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
           </div>
           <div className="flex-1 min-w-0">
             <p className="text-base font-semibold text-ink-light dark:text-ink-dark truncate">{user?.full_name?.split(" ")[0]}</p>
             <p className="text-sm text-soft-400">Level {user?.current_level}</p>
           </div>
         </div>
        <div className="flex items-center gap-3 mt-3 pt-3" style={{ borderTop: "1px solid var(--mg-border)" }}>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-warning">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>{user?.xp_points ?? 0} XP</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-danger">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            </svg>
            <span>{user?.streak_count ?? 0} day</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 mb-5">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "shadow-md"
                  : "hover:shadow-sm"
              }`
            }
            style={({ isActive }) => ({
              background: isActive ? "linear-gradient(135deg, var(--mg-accent), var(--mg-accent-strong))" : "transparent",
              color: isActive ? "white" : "var(--mg-ink-soft)",
              boxShadow: isActive ? "0 4px 12px -2px var(--mg-glow)" : "none",
              transform: isActive ? "translateX(4px)" : "translateX(0)"
            })}
          >
            <NavIcon path={item.icon} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Theme toggle */}
      <button
        onClick={toggle}
        className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 mb-1"
        style={{ color: "var(--mg-ink-soft)" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--mg-glass)";
          e.currentTarget.style.boxShadow = "0 2px 8px -2px var(--mg-glow)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {dark ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Light Mode
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            Dark Mode
          </>
        )}
      </button>

      {/* Logout */}
      <button
        onClick={() => { logout(); navigate("/login"); }}
        className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200"
        style={{ color: "var(--mg-ink-soft)" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
          e.currentTarget.style.color = "#EF4444";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--mg-ink-soft)";
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Log out
      </button>
    </aside>
  );
}