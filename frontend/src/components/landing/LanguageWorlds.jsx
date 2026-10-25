import { motion } from "framer-motion";
import { Globe, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import Reveal from "./magic/Reveal";
import WorldArt from "./art/WorldArt";

const LANGUAGES = [
  { lang: "english", name: "English", flag: "🇬🇧", desc: "The global language of business, science, and culture." },
  { lang: "spanish", name: "Spanish", flag: "🇪🇸", desc: "Spoken by 500M+ people across 20+ vibrant countries." },
  { lang: "french", name: "French", flag: "🇫🇷", desc: "The language of love, art, and fine cuisine." },
  { lang: "japanese", name: "Japanese", flag: "🇯🇵", desc: "Gateway to anime, tradition, and innovation." },
  { lang: "korean", name: "Korean", flag: "🇰🇷", desc: "The rising star of K-pop, drama, and technology." },
];

export default function LanguageWorlds() {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      const amount = 320;
      scrollRef.current.scrollBy({ left: dir * amount, behavior: "smooth" });
    }
  };

  return (
    <section id="courses" className="relative py-10 md:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-8 lg:gap-12 items-start">
          {/* Left — heading + CTA */}
          <Reveal className="lg:sticky lg:top-32">
            <span className="kicker mb-4">
              <Globe className="w-4 h-4" />
              Language Worlds
            </span>
            <h2 className="font-display font-extrabold text-5xl md:text-6xl lg:text-7xl text-mystic-ink mb-4 text-balance">
              A world of languages at your <span className="text-gradient-accent">fingertips</span>
            </h2>
            <p className="text-xl md:text-2xl text-mystic-ink-soft mb-6 leading-relaxed">
              Instead of courses, every language is its own fantasy world.
              Explore rich cultures, immersive stories, and interactive adventures
              that make learning feel like traveling.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <a href="#cta" onClick={(e) => { e.preventDefault(); document.querySelector("#cta")?.scrollIntoView({ behavior: "smooth" }); }} className="btn-magic" style={{ padding: "0.85rem 1.75rem", fontSize: "1.125rem" }}>
                Explore All Courses
                <ArrowRight className="w-5 h-5" />
              </a>
              {/* Scroll arrows */}
              <div className="flex gap-2">
                <button
                  onClick={() => scroll(-1)}
                  aria-label="Scroll left"
                  className="w-11 h-11 rounded-full glass-magic flex items-center justify-center text-mystic-ink hover:scale-110 hover:shadow-lg transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scroll(1)}
                  aria-label="Scroll right"
                  className="w-11 h-11 rounded-full glass-magic flex items-center justify-center text-mystic-ink hover:scale-110 hover:shadow-lg transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </Reveal>

          {/* Right — scrollable cards */}
          <Reveal delay={0.15}>
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto no-scrollbar pb-3 -mx-2 px-2 snap-x snap-mandatory"
            >
              {LANGUAGES.map((lang, i) => (
                <motion.div
                  key={lang.lang}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="shrink-0 w-[290px] md:w-[310px] snap-center group cursor-pointer"
                >
                  <div className="glass-magic overflow-hidden h-full transition-shadow duration-300 group-hover:shadow-xl" style={{ borderRadius: 24 }}>
                    {/* Art */}
                    <div className="relative overflow-hidden">
                      <WorldArt lang={lang.lang} className="w-full h-auto transition-transform duration-500 group-hover:scale-105" />
                      {/* Flag badge */}
                      <div
                        className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center text-xl glass-magic"
                        style={{ borderRadius: "50%" }}
                      >
                        {lang.flag}
                      </div>
                    </div>
                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-display font-bold text-xl text-mystic-ink mb-1">
                        {lang.name}
                      </h3>
                      <p className="text-base text-mystic-ink-soft leading-relaxed mb-2.5">
                        {lang.desc}
                      </p>
                      <div className="flex items-center gap-1.5 text-base font-semibold group-hover:gap-2.5 transition-all duration-300" style={{ color: "var(--mg-accent)" }}>
                        Start adventure
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}