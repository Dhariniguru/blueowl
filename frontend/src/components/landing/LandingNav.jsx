import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, X, Sparkles } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

const NAV_LINKS = [
  { label: "Home", href: "#top" },
  { label: "Courses", href: "#courses" },
  { label: "Practice", href: "#practice" },
  { label: "Progress", href: "#journey" },
  { label: "AI Assistant", href: "#assistant" },
  { label: "Pricing", href: "#cta" },
];

function scrollToId(href) {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function LandingNav() {
  const { dark, toggle } = useTheme();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    scrollToId(href);
    setMobileOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={"fixed top-0 left-0 right-0 z-50 transition-all duration-300 " + (scrolled ? "py-1.5" : "py-3")}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div
          className={"flex items-center justify-between rounded-full px-4 md:px-6 transition-all duration-300 " + (scrolled ? "glass-magic shadow-lg py-2.5" : "py-3.5")}
          style={scrolled ? { boxShadow: "0 8px 32px -8px var(--mg-glow)" } : {}}
        >
          <a href="#top" onClick={(e) => handleNavClick(e, "#top")} className="flex items-center gap-2.5 shrink-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
              style={{ background: "linear-gradient(135deg, var(--mg-accent), var(--mg-accent-strong))", boxShadow: "0 4px 12px -2px var(--mg-glow)" }}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-display font-extrabold text-xl tracking-tight text-mystic-ink">
              neo<span className="text-mystic-accent">+</span> learning
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-4 py-2.5 rounded-full text-nav-text font-medium text-mystic-ink-soft hover:text-mystic-ink hover:bg-mystic-glass hover:scale-[1.03] transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="w-11 h-11 rounded-full flex items-center justify-center text-mystic-ink-soft hover:text-mystic-ink hover:bg-mystic-glass hover:scale-105 transition-all duration-200"
            >
              <AnimatePresence mode="wait">
                {dark ? (
                  <motion.span key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.25 }}>
                    <Moon className="w-5 h-5" />
                  </motion.span>
                ) : (
                  <motion.span key="sun" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.25 }}>
                    <Sun className="w-5 h-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <Link to={user ? "/dashboard" : "/register"} className="hidden sm:inline-flex btn-magic" style={{ padding: "0.65rem 1.5rem", fontSize: "1rem" }}>
              Get Started
            </Link>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
              className="lg:hidden w-11 h-11 rounded-full flex items-center justify-center text-mystic-ink hover:bg-mystic-glass transition-all"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden mt-2 glass-magic rounded-3xl p-4 overflow-hidden"
            >
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="px-4 py-3 rounded-2xl text-base font-medium text-mystic-ink-soft hover:text-mystic-ink hover:bg-mystic-glass transition-all"
                  >
                    {link.label}
                  </a>
                ))}
                <Link to={user ? "/dashboard" : "/register"} className="btn-magic mt-2" style={{ padding: "0.75rem 1.5rem", fontSize: "0.95rem" }}>
                  Get Started
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}