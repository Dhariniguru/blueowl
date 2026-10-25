import { useEffect, useRef } from "react";

/**
 * A soft radial spotlight that follows the cursor — adds a dreamy,
 * interactive glow across the landing page. Disabled on touch devices.
 */
export default function CursorGlow() {
  const ref = useRef(null);

  useEffect(() => {
    // Skip on touch / small screens
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let raf = 0;
    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (ref.current) {
          ref.current.style.left = `${e.clientX}px`;
          ref.current.style.top = `${e.clientY}px`;
          ref.current.style.opacity = "1";
        }
      });
    };
    const onLeave = () => {
      if (ref.current) ref.current.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <div ref={ref} className="cursor-glow" style={{ opacity: 0 }} aria-hidden />;
}