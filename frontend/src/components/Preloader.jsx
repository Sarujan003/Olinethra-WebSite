import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePreloader } from "../context/PreloaderContext";

const LETTERS = "OLINETHRA".split("");

// Curtain easing — matches the spec [0.76, 0, 0.24, 1]
const CURTAIN_EASE = [0.76, 0, 0.24, 1];

export default function Preloader() {
    const { setPreloaderDone } = usePreloader();
    const [counter, setCounter] = useState(0);
    const [exitReady, setExitReady] = useState(false);
    const [visible, setVisible] = useState(true);
    const rafRef = useRef(null);

    // Lock scroll while preloader is active
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    // Numeric counter: 0 → 100 over ~1.6 s
    useEffect(() => {
        const DURATION = 1600;
        const start = performance.now();

        const tick = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / DURATION, 1);
            const eased = 1 - Math.pow(1 - progress, 2); // ease-out quad
            const val = Math.round(eased * 100);
            setCounter(val);

            if (progress < 1) {
                rafRef.current = requestAnimationFrame(tick);
            } else {
                setCounter(100);
                // Short pause then trigger exit curtain
                setTimeout(() => setExitReady(true), 200);
            }
        };

        // Small delay so letters animate first
        const startTimer = setTimeout(() => {
            rafRef.current = requestAnimationFrame(tick);
        }, 400);

        return () => {
            clearTimeout(startTimer);
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    key="preloader"
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0B1020] select-none"
                    animate={exitReady ? { y: "-100%" } : { y: 0 }}
                    transition={exitReady ? { duration: 0.9, ease: CURTAIN_EASE } : { duration: 0 }}
                    onAnimationComplete={() => {
                        if (exitReady) {
                            setVisible(false);
                            setPreloaderDone(true);
                        }
                    }}
                >
                    {/* Ambient gradient orbs */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div
                            className="absolute top-[20%] left-[15%] w-[500px] h-[500px] rounded-full opacity-20"
                            style={{ background: "radial-gradient(circle, #1F4BE0 0%, transparent 70%)" }}
                        />
                        <div
                            className="absolute bottom-[15%] right-[10%] w-[400px] h-[400px] rounded-full opacity-15"
                            style={{ background: "radial-gradient(circle, #EA580C 0%, transparent 70%)" }}
                        />
                    </div>

                    {/* Company name — split-text mask reveal */}
                    <div className="relative z-10 flex items-end gap-[2px] sm:gap-[4px] overflow-hidden pb-2">
                        {LETTERS.map((letter, i) => (
                            <motion.span
                                key={i}
                                className="text-white font-black tracking-tight leading-none select-none"
                                style={{
                                    fontSize: "clamp(52px, 10vw, 120px)",
                                    fontFamily: "'Manrope', 'Inter', system-ui, sans-serif",
                                    clipPath: "inset(0 0 0 0)",
                                    display: "inline-block",
                                }}
                                initial={{ y: "110%", opacity: 0 }}
                                animate={{ y: "0%", opacity: 1 }}
                                transition={{
                                    duration: 0.65,
                                    delay: 0.05 + i * 0.055,
                                    ease: [0.2, 0.7, 0.2, 1],
                                }}
                            >
                                {letter}
                            </motion.span>
                        ))}
                    </div>

                    {/* Subtitle */}
                    <motion.p
                        className="relative z-10 mt-3 text-[#5E6780] font-mono text-[11px] sm:text-[13px] tracking-[0.18em] uppercase"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                    >
                        Engineering &amp; AI Systems
                    </motion.p>

                    {/* Counter */}
                    <motion.div
                        className="relative z-10 mt-10 flex flex-col items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                    >
                        {/* Progress bar */}
                        <div className="w-48 sm:w-64 h-[2px] bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-[#1F4BE0] rounded-full"
                                style={{ width: `${counter}%` }}
                                transition={{ ease: "linear" }}
                            />
                        </div>
                        {/* Number */}
                        <span
                            className="text-white/40 font-mono text-[13px] tabular-nums tracking-widest"
                        >
                            {String(counter).padStart(2, "0")}%
                        </span>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
