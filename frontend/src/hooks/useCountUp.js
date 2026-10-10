import { useState, useEffect, useRef } from "react";

/**
 * useCountUp
 * Counts from 0 to `target` over `duration` ms whenever `inView` becomes true.
 * Returns the current display value (number).
 */
export function useCountUp(target, duration = 1800, inView = false) {
    const [value, setValue] = useState(0);
    const rafRef = useRef(null);
    const startedRef = useRef(false);

    useEffect(() => {
        if (!inView || startedRef.current) return;
        startedRef.current = true;

        const startTime = performance.now();

        const tick = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target * 100) / 100);
            if (progress < 1) {
                rafRef.current = requestAnimationFrame(tick);
            } else {
                setValue(target);
            }
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, [inView, target, duration]);

    return value;
}
