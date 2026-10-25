import { Sparkles, Globe, MessageCircle, Share2, Play, Mail, ArrowRight } from "lucide-react";
import Reveal from "./magic/Reveal";

const COLUMNS = [
  { title: "Product", links: ["Courses", "AI Assistant", "Pronunciation", "Progress", "Achievements"] },
  { title: "Company", links: ["About Us", "Careers", "Blog", "Press Kit", "Contact"] },
  { title: "Support", links: ["Help Center", "Community", "Privacy Policy", "Terms of Service", "FAQ"] },
];

const SOCIALS = [
  { icon: Globe, label: "Twitter" },
  { icon: MessageCircle, label: "GitHub" },
  { icon: Share2, label: "LinkedIn" },
  { icon: Play, label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="relative pt-8 pb-5">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <Reveal>
          <div className="glass-magic p-6 md:p-8" style={{ borderRadius: 32 }}>
            <div className="grid lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-6 lg:gap-10">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                    style={{ background: "linear-gradient(135deg, var(--mg-accent), var(--mg-accent-strong))", boxShadow: "0 4px 12px -2px var(--mg-glow)" }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="font-display font-extrabold text-xl text-mystic-ink">
                    neo<span style={{ color: "var(--mg-accent)" }}>+</span> learning
                  </span>
                </div>
                <p className="text-base text-mystic-ink-soft mb-4 leading-relaxed max-w-xs">
                  A magical, AI-powered language learning platform where every language is its own world.
                </p>
                <div className="flex items-center gap-2 max-w-sm">
                  <div
                    className="flex items-center gap-2 flex-1 rounded-full px-4 py-2.5"
                    style={{ background: "var(--mg-glass)", border: "1px solid var(--mg-border)" }}
                  >
                    <Mail className="w-4 h-4 text-mystic-ink-soft shrink-0" />
                    <input
                      type="email"
                      placeholder="Your email"
                      className="bg-transparent border-none outline-none text-base text-mystic-ink placeholder:text-mystic-ink-soft flex-1 min-w-0"
                    />
                  </div>
                  <button
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white shrink-0 hover:scale-110 transition-transform duration-200"
                    style={{ background: "linear-gradient(135deg, var(--mg-accent), var(--mg-accent-strong))", boxShadow: "0 4px 12px -2px var(--mg-glow)" }}
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {COLUMNS.map((col) => (
                <div key={col.title}>
                  <h4 className="font-display font-bold text-base text-mystic-ink mb-3">{col.title}</h4>
                  <ul className="space-y-2">
                    {col.links.map((link) => (
                      <li key={link}>
                        <a href="#" onClick={(e) => e.preventDefault()} className="text-base text-mystic-ink-soft hover:text-mystic-ink hover:pl-1 transition-all duration-200">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div
              className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 pt-5 border-t"
              style={{ borderColor: "var(--mg-border)" }}
            >
              <p className="text-sm text-mystic-ink-soft">
                © 2025 Neo Learning. All rights reserved. Made with magic.
              </p>
              <div className="flex items-center gap-2">
                {SOCIALS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.label}
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      aria-label={s.label}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-mystic-ink-soft hover:text-mystic-ink transition-all hover:scale-110 hover:shadow-md"
                      style={{ background: "var(--mg-glass)" }}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}