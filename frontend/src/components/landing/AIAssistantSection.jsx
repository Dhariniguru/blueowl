import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bot, ArrowRight } from "lucide-react";
import Reveal from "./magic/Reveal";
import AssistantArt from "./art/AssistantArt";
import { useAuth } from "../../context/AuthContext";

export default function AIAssistantSection() {
  const { user } = useAuth();

  return (
    <section id="assistant" className="relative py-10 md:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <Reveal>
            <div className="relative parallax-slow">
              <div
                className="absolute inset-0 rounded-[2rem] blur-3xl opacity-30"
                style={{ background: "radial-gradient(circle, var(--mg-glow), transparent 70%)" }}
              />
              <AssistantArt className="w-full h-auto relative" />
            </div>
          </Reveal>

          <Reveal delay={0.15} className="lg:pl-4">
            <span className="kicker mb-4">
              <Bot className="w-4 h-4" />
              AI Assistant
            </span>
            <h2 className="font-display font-extrabold text-5xl md:text-6xl lg:text-7xl text-mystic-ink mb-4 text-balance">
              Your magical <span className="text-gradient-accent">AI companion</span>
            </h2>
            <p className="text-xl md:text-2xl text-mystic-ink-soft mb-6 leading-relaxed">
              Meet your personal AI tutor — available 24/7 to answer questions,
              explain grammar, practice conversations, and give you feedback on
              your pronunciation. It's like having a patient friend who never
              tires of helping you learn.
            </p>

            <div className="glass-magic p-5 mb-6 space-y-3" style={{ borderRadius: 28 }}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex items-start gap-3 justify-end"
              >
                <div
                  className="rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[75%]"
                  style={{ background: "var(--mg-accent)", color: "#fff" }}
                >
                  <p className="text-base font-medium">How do I say "good morning" in Japanese?</p>
                </div>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ background: "#FF8FB1" }}
                >
                  A
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex items-start gap-3"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0"
                  style={{ background: "linear-gradient(135deg, var(--mg-accent), var(--mg-accent-strong))" }}
                >
                  <Bot className="w-4 h-4" />
                </div>
                <div
                  className="rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[75%]"
                  style={{ background: "var(--mg-glass)", border: "1px solid var(--mg-border)" }}
                >
                  <p className="text-base text-mystic-ink">
                    Good morning in Japanese is <span className="font-bold" style={{ color: "var(--mg-accent)" }}>おはよう</span> (ohayō).
                    It's used casually with friends and family. For formal situations, add
                    <span className="font-bold" style={{ color: "var(--mg-accent)" }}>ございます</span> (gozaimasu).
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1 }}
                className="flex items-center gap-2"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0"
                  style={{ background: "linear-gradient(135deg, var(--mg-accent), var(--mg-accent-strong))" }}
                >
                  <Bot className="w-4 h-4" />
                </div>
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </motion.div>
            </div>

            <Link to={user ? "/dashboard" : "/register"} className="btn-magic">
              Try AI Assistant
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}