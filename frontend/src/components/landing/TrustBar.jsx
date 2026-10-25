import { motion } from "framer-motion";
import Reveal from "./magic/Reveal";

const PARTNERS = ["Google", "Microsoft", "Coursera", "Duolingo", "Udemy"];

export default function TrustBar() {
  return (
    <section className="relative py-12">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <Reveal className="text-center mb-6">
          <p className="text-sm font-medium text-mystic-ink-soft">
            Trusted by learners and teams worldwide
          </p>
        </Reveal>
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {PARTNERS.map((name, i) => (
            <motion.span
              key={name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 0.55, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="font-display font-bold text-lg md:text-xl text-mystic-ink tracking-tight"
            >
              {name}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}