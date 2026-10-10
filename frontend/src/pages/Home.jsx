import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { collection, onSnapshot, orderBy, query, where, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { usePreloader } from "../context/PreloaderContext";
import { useCountUp } from "../hooks/useCountUp";

/* ─────────────────────────────────────────────────────
   Small reusable animation helpers
───────────────────────────────────────────────────── */

/** Section wrapper that slides up + fades in when scrolled into view */
function RevealSection({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ y: 30, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.65, ease: [0.2, 0.7, 0.2, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/** Container that staggers its direct children */
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const cardVariant = {
  hidden: { y: 28, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.2, 0.7, 0.2, 1] } },
};

/* ─────────────────────────────────────────────────────
   Leave a Review Modal — submitted reviews go to Firestore
   with status:'pending' for admin approval
───────────────────────────────────────────────────── */
const STAR_LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

function ReviewModal({ onClose }) {
  const [form, setForm] = useState({ name: "", role: "", quote: "", rating: 5 });
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.quote.trim()) return;
    setSubmitting(true);
    try {
      const parts = form.name.trim().split(" ");
      const initials = parts.length > 1
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : parts[0].slice(0, 2).toUpperCase();
      await addDoc(collection(db, "clientReviews"), {
        ...form,
        rating: Number(form.rating),
        initials,
        status: "pending",          // admin must approve before it shows
        createdAt: serverTimestamp(),
      });
      setDone(true);
    } catch (err) {
      console.error("Review submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[500] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        />
        {/* Panel */}
        <motion.div
          className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg z-10"
          initial={{ scale: 0.92, y: 24, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.92, y: 16, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors" aria-label="Close">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>

          {done ? (
            <motion.div className="text-center py-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-[32px]">check_circle</span>
              </div>
              <h3 className="text-xl font-extrabold text-[#0B1020] mb-2">Thank you!</h3>
              <p className="text-[14px] text-[#475069] leading-relaxed">
                Your review has been submitted and is pending approval. We'll publish it once reviewed.
              </p>
              <button onClick={onClose} className="mt-6 px-6 py-2.5 rounded-lg bg-[#1F4BE0] text-white font-semibold text-[14px] hover:bg-[#1A3FC4] transition-colors">
                Close
              </button>
            </motion.div>
          ) : (
            <>
              <h2 className="text-2xl font-extrabold text-[#0B1020] mb-1">Leave a Review</h2>
              <p className="text-[13px] text-[#5E6780] mb-6">Share your experience working with Olinethra Engineering &amp; AI.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Star rating */}
                <div>
                  <label className="block text-[13px] font-semibold mb-2">Your Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button key={n} type="button"
                        onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
                        onClick={() => setForm(f => ({ ...f, rating: n }))}
                        className="text-[28px] transition-transform hover:scale-110 focus:outline-none"
                        aria-label={`${n} star`}
                      >
                        <span style={{ color: n <= (hover || form.rating) ? "#EA580C" : "#CBD5E1" }}>★</span>
                      </button>
                    ))}
                    <span className="ml-2 text-[13px] font-semibold text-[#5E6780]">{STAR_LABELS[hover || form.rating]}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold mb-1">Full Name *</label>
                  <input required type="text" className="w-full h-11 px-3 rounded-lg bg-[#f2f3ff] text-[14px] outline-none focus:ring-2 focus:ring-[#1F4BE0]/30"
                    placeholder="e.g. Marcus Reynolds" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold mb-1">Role &amp; Company</label>
                  <input type="text" className="w-full h-11 px-3 rounded-lg bg-[#f2f3ff] text-[14px] outline-none focus:ring-2 focus:ring-[#1F4BE0]/30"
                    placeholder="e.g. CTO, Acme Corp" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold mb-1">Your Review *</label>
                  <textarea required rows={4} className="w-full p-3 rounded-lg bg-[#f2f3ff] text-[14px] outline-none focus:ring-2 focus:ring-[#1F4BE0]/30 resize-none"
                    placeholder="Share your experience with the team, delivery quality, and outcomes..."
                    value={form.quote} onChange={e => setForm(f => ({ ...f, quote: e.target.value }))} />
                </div>
                <button type="submit" disabled={submitting}
                  className="w-full py-3 rounded-lg bg-[#1F4BE0] text-white font-bold text-[14px] hover:bg-[#1A3FC4] transition-colors disabled:opacity-60">
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
                <p className="text-center text-[12px] text-[#5E6780]">Your review will appear after admin approval.</p>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────
   Animated stat card
───────────────────────────────────────────────────── */
function StatCard({ label, rawValue, suffix, prefix, description, accentClass, delay, specialLabel }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  // Don't count up for text-only labels
  const count = useCountUp(specialLabel ? 0 : rawValue, 1800, inView);

  const display = specialLabel
    ? specialLabel
    : rawValue % 1 === 0
      ? `${prefix || ""}${Math.round(count)}${suffix || ""}`
      : `${prefix || ""}${count.toFixed(2)}${suffix || ""}`;

  return (
    <motion.div
      ref={ref}
      className="stat"
      variants={cardVariant}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <span className="stat-label">{label}</span>
      <motion.span
        className={`stat-metric ${accentClass || ""}`}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: delay || 0, duration: 0.4 }}
      >
        {display}
      </motion.span>
      <span className="stat-desc">{description}</span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────
   Hero headline: per-line mask reveal with mixed colours
   Reference pattern:
     Line 0 – all dark
     Line 1 – "Software & " dark + "Intelligent" blue
     Line 2 – "Cloud" purple + " Systems" orange + " for" dark
     Line 3 – "Ambitious Brands" dark
───────────────────────────────────────────────────── */
const HEADLINE_LINES = [
  [{ text: "Engineering Scalable", c: "dark" }],
  [{ text: "Software & ", c: "dark" }, { text: "Intelligent", c: "blue" }],
  [{ text: "Cloud", c: "purple" }, { text: " Systems", c: "orange" }, { text: " for", c: "dark" }],
  [{ text: "Ambitious Brands", c: "dark" }],
];

const segColor = {
  dark: "text-[#0B1020]",
  blue: "text-[#1F4BE0]",
  purple: "text-[#7C3AED]",
  orange: "text-[#EA580C]",
};

function HeroHeadline({ ready }) {
  return (
    <div className="flex flex-col" style={{ gap: "0.05em" }}>
      {HEADLINE_LINES.map((segments, i) => (
        // paddingBottom gives room for descenders (g, y, p…);
        // negative marginBottom cancels the extra space in layout.
        <div
          key={i}
          className="overflow-hidden"
          style={{ paddingBottom: "0.18em", marginBottom: "-0.18em", lineHeight: 1.1 }}
        >
          <motion.span
            className="block text-4xl md:text-6xl font-extrabold tracking-tight"
            initial={{ y: "110%" }}
            animate={ready ? { y: "0%" } : {}}
            transition={{ duration: 0.75, delay: 0.1 + i * 0.13, ease: [0.2, 0.7, 0.2, 1] }}
          >
            {segments.map((seg, j) => (
              <span key={j} className={segColor[seg.c]}>{seg.text}</span>
            ))}
          </motion.span>
        </div>
      ))}
    </div>
  );
}


/* ─────────────────────────────────────────────────────
   Main Home Component
───────────────────────────────────────────────────── */
const STATIC_STACKS = [];

export default function Home() {
  const { preloaderDone } = usePreloader();
  const heroReady = preloaderDone;

  const [terminalTab, setTerminalTab] = useState("health");
  const [techStacks, setTechStacks] = useState(STATIC_STACKS);
  const [reviews, setReviews] = useState([]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [techLoading, setTechLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const containerRef = useRef(null);
  const singleTrackRef = useRef(null);

  /* ── Firestore subscriptions ── */
  useEffect(() => {
    let unsubTech = () => { };
    let unsubReviews = () => { };
    try {
      const qTech = query(collection(db, "techStacks"), orderBy("createdAt"));
      unsubTech = onSnapshot(qTech,
        snap => { setTechStacks(snap.empty ? [] : snap.docs.map(d => ({ id: d.id, ...d.data() }))); setTechLoading(false); },
        () => setTechLoading(false)
      );
      const qReviews = collection(db, "clientReviews");
      unsubReviews = onSnapshot(qReviews,
        snap => {
          if (snap.empty) {
            setReviews([]);
          } else {
            const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            // Filter: show reviews where status is "approved" OR missing (legacy docs default to approved)
            const approvedDocs = docs.filter(r => (r.status || "approved") === "approved");
            // Sort by createdAt desc in JS (handling timestamp objects or numbers)
            approvedDocs.sort((a, b) => {
              const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (a.createdAt || 0);
              const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (b.createdAt || 0);
              return timeB - timeA;
            });
            setReviews(approvedDocs);
          }
          setReviewsLoading(false);
        },
        (err) => {
          console.error("Firestore clientReviews error:", err);
          setReviewsLoading(false);
        }
      );
    } catch { setTechLoading(false); setReviewsLoading(false); }
    return () => { unsubTech(); unsubReviews(); };
  }, []);

  /* ── Marquee overflow detection ── */
  useEffect(() => {
    if (techLoading || techStacks.length === 0) return;
    const checkOverflow = () => {
      if (containerRef.current && singleTrackRef.current) {
        const style = window.getComputedStyle(containerRef.current);
        const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
        setIsOverflowing(singleTrackRef.current.scrollWidth > containerRef.current.clientWidth - padding);
      }
    };
    checkOverflow();
    const timer = setTimeout(checkOverflow, 200);
    const ro = new ResizeObserver(checkOverflow);
    if (containerRef.current) ro.observe(containerRef.current);
    if (singleTrackRef.current) ro.observe(singleTrackRef.current);
    window.addEventListener("resize", checkOverflow);
    return () => { clearTimeout(timer); ro.disconnect(); window.removeEventListener("resize", checkOverflow); };
  }, [techStacks, techLoading]);

  const marqueeItems = isOverflowing
    ? [...techStacks, ...techStacks, ...techStacks, ...techStacks]
    : techStacks;

  /* ── Reviews carousel ── */
  useEffect(() => {
    if (reviews.length > 0 && reviewIndex >= reviews.length) setReviewIndex(0);
  }, [reviews.length, reviewIndex]);

  const visibleCount = Math.min(3, reviews.length);
  const currentReviews = Array.from({ length: visibleCount }).map((_, i) => {
    const idx = (reviewIndex + i) % reviews.length;
    return { ...reviews[idx], _virtualKey: `${reviews[idx].id || idx}-${i}` };
  });

  const prevReviewPage = () => setReviewIndex(prev => (prev === 0 ? reviews.length - 1 : prev - 1));
  const nextReviewPage = () => setReviewIndex(prev => (prev + 1) % reviews.length);

  return (
    <div className="bg-[#faf8ff] min-h-screen text-[#171b26]">
      {/* ── Global animation styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap');

        /* Entrance rise animation */
        @keyframes rise {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .rise { opacity: 0; animation: rise 0.7s cubic-bezier(.2,.7,.2,1) forwards; }
        .d4  { animation-delay: 0.28s; }
        .d5  { animation-delay: 0.42s; }
        .d6  { animation-delay: 0.50s; }
        .d7  { animation-delay: 0.58s; }
        .d8  { animation-delay: 0.66s; }

        /* Dot-grid background */
        .dot-grid {
          background-image: radial-gradient(circle, rgba(31,75,224,0.12) 1.5px, transparent 1.5px);
          background-size: 28px 28px;
        }

        /* Floating ambient orbs */
        @keyframes floatA {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(18px,-22px) scale(1.05); }
        }
        @keyframes floatB {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(-14px,18px) scale(1.04); }
        }
        .orb-a { animation: floatA 10s ease-in-out infinite; }
        .orb-b { animation: floatB 13s ease-in-out infinite; }

        /* Explore Services button */
        .btn-primary {
          display: inline-flex; align-items: center; justify-content: center; gap: 10px;
          min-height: 52px; padding: 0 22px; border-radius: 12px;
          background: #1F4BE0; color: #FFFFFF;
          font-size: 15.5px; font-weight: 700; font-family: 'Manrope', system-ui, sans-serif;
          text-decoration: none;
          box-shadow: 0 1px 2px rgba(11,16,32,.12), 0 8px 18px -8px rgba(31,75,224,.6);
          transition: background .15s ease, transform .15s ease;
          position: relative; overflow: hidden; border: none; cursor: pointer;
        }
        .btn-primary:focus-visible { outline: 2px solid #7C3AED; outline-offset: 2px; }
        .btn-primary:hover { background: #1A3FC4; transform: translateY(-1px); }
        .btn-primary:active { transform: translateY(0); }
        .btn-primary .arrow { display: inline-flex; transition: transform .15s ease; }
        .btn-primary:hover .arrow { transform: translateX(4px); }
        .btn-primary::after {
          content: ''; position: absolute; top: -30%; left: -60%;
          width: 40%; height: 160%;
          background: linear-gradient(100deg, transparent, rgba(255,255,255,.3), transparent);
          transform: skewX(-18deg); transition: left 0.6s ease; pointer-events: none;
        }
        .btn-primary:hover::after { left: 120%; }

        /* Stat cards */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(240px,100%), 1fr));
          gap: 16px;
        }
        .stat {
          display: flex; flex-direction: column; gap: 12px;
          padding: 24px; border-radius: 16px;
          background: #FFFFFF; border: 1px solid #E4E8F0;
          box-shadow: 0 1px 2px rgba(11,16,32,.04);
          transition: box-shadow .2s ease, border-color .2s ease;
          cursor: default;
        }
        .stat:hover { border-color: #C9D0E2; box-shadow: 0 16px 30px -18px rgba(11,16,32,.32); }
        .stat-label {
          font-family: 'JetBrains Mono', 'Fira Mono', monospace;
          font-size: 11.5px; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; color: #5E6780;
        }
        .stat-metric {
          font-size: 40px; font-weight: 800; line-height: 1;
          letter-spacing: -0.03em; font-variant-numeric: tabular-nums; color: #0B1020;
        }
        .stat-metric.accent-purple { color: #7C3AED; }
        .stat-metric.accent-orange { color: #EA580C; }
        .stat-desc { font-size: 14.5px; color: #475069; line-height: 1.45; }

        /* Marquee */
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          will-change: transform;
        }
        .animate-marquee:hover { animation-play-state: paused; }

        /* Prefers reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .rise { animation: none; opacity: 1; }
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      {/* ── HERO SECTION ── */}
      <section className="relative w-full overflow-hidden pb-16 pt-28">
        {/* Dot-grid + ambient orbs */}
        <div className="dot-grid absolute inset-0 pointer-events-none" />
        <div className="absolute top-[-180px] left-[-120px] w-[600px] h-[600px] rounded-full opacity-30 orb-a pointer-events-none"
          style={{ background: "radial-gradient(circle, #1F4BE060 0%, transparent 70%)" }} />
        <div className="absolute bottom-[-100px] right-[-80px] w-[480px] h-[480px] rounded-full opacity-20 orb-b pointer-events-none"
          style={{ background: "radial-gradient(circle, #EA580C50 0%, transparent 70%)" }} />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 flex flex-col gap-6">

              {/* Eyebrow label */}
              <motion.span
                className="text-[13px] font-mono font-bold uppercase tracking-wider text-[#1F4BE0]"
                initial={{ opacity: 0, y: 12 }}
                animate={heroReady ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.05 }}
              >
                Olinethra Engineering &amp; AI
              </motion.span>

              {/* Headline mask reveal */}
              <HeroHeadline ready={heroReady} />

              {/* Sub-text */}
              <motion.p
                className="text-[18px] text-[#424656] max-w-2xl leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={heroReady ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, delay: 0.52, ease: [0.2, 0.7, 0.2, 1] }}
              >
                We architect next-generation web platforms, enterprise AI solutions, and distributed systems
                with uncompromising speed, security, and precision. Built for 99.999% reliability under extreme load.
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                className="flex flex-wrap items-center gap-4 pt-2"
                initial={{ opacity: 0, y: 20 }}
                animate={heroReady ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, delay: 0.65, ease: [0.2, 0.7, 0.2, 1] }}
              >
                <Link to="/services" className="btn-primary">
                  <span>Explore Services</span>
                  <span className="arrow">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </Link>
                <Link to="/projects" className="px-6 py-3 rounded-lg bg-[#ebedfc] text-[#171b26] font-semibold text-[14px] hover:bg-[#dfe2f1] transition-colors flex items-center gap-2">
                  <span>View Case Studies</span>
                  <span className="material-symbols-outlined text-[18px]">terminal</span>
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                className="pt-4 flex flex-wrap gap-6 text-[13px] text-[#424656]"
                initial={{ opacity: 0 }}
                animate={heroReady ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <span className="flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[#1F4BE0] text-[18px]">verified</span>
                  SOC-2 Type II Certified
                </span>
                <span className="flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[#EA580C] text-[18px]">bolt</span>
                  &lt;250ms Global P99
                </span>
                <span className="flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[#006178] text-[18px]">cloud_sync</span>
                  40+ Multi-Region Nodes
                </span>
              </motion.div>
            </div>

            {/* Right: Video */}
            <motion.div
              className="lg:col-span-5 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={heroReady ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
            >
              <div className="relative w-full aspect-[4/4.9] rounded-2xl overflow-hidden border border-black/10 shadow-2xl bg-white">
                <video
                  src="https://res.cloudinary.com/dc457saw0/video/upload/v1791293727/Home_page_Right_Image_Animaction.webm"
                  autoPlay loop muted playsInline
                  className="w-full h-full object-cover scale-x-[1.28] scale-y-[1.38] origin-[22%_50%] pointer-events-none"
                />
              </div>
            </motion.div>
          </div>

          {/* ── Animated Stat Cards ── */}
          <motion.div
            className="mt-16 stats-grid"
            variants={staggerContainer}
            initial="hidden"
            animate={heroReady ? "visible" : "hidden"}
          >
            <StatCard label="Service Guarantee" rawValue={99.99} suffix="%" description="Guaranteed SLA Uptime Target" delay={0} />
            <StatCard label="Edge Dispatch" rawValue={250} prefix="<" suffix="ms" description="Global P99 Worldwide Edge" accentClass="accent-orange" delay={0.1} />
            <StatCard label="Deployments" rawValue={40} suffix="+" description="Fortune 1000 & Scalers" delay={0.2} />
            <StatCard label="Compliance" specialLabel="SOC‑2" description="Type II & HIPAA Hardened" accentClass="accent-purple" delay={0.3} />
          </motion.div>
        </div>
      </section>

      {/* Hidden measurement track */}
      <div className="invisible fixed top-0 left-0 pointer-events-none flex gap-5 w-max opacity-0" ref={singleTrackRef}>
        {techStacks.map((stack, idx) => (
          <div key={stack.id || idx} className="px-5 py-4 min-w-[220px] max-w-[280px] flex items-center gap-3.5 shrink-0">
            <div className="w-9 h-9 shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="font-bold text-[14px] text-[#171b26] block truncate leading-snug">{stack.label}</span>
              <span className="text-[12px] font-mono text-slate-400 block truncate leading-snug">{stack.sub || "Core Stack"}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tech Stack Marquee ── */}
      <section className="bg-[#f2f3ff] py-12 border-y border-black/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12" ref={containerRef}>
          <RevealSection className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[12px] font-mono text-[#1F4BE0] font-bold uppercase">Core Infrastructure</span>
              <h2 className="text-2xl font-bold">Battle-Tested Modern Stack</h2>
            </div>
            <p className="text-[14px] text-[#424656]">Designed with zero legacy dependencies and clean architecture principles.</p>
          </RevealSection>

          <div className="relative overflow-hidden w-full">
            {isOverflowing && !techLoading && (
              <>
                <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#f2f3ff] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#f2f3ff] to-transparent z-10 pointer-events-none" />
              </>
            )}
            {techLoading ? (
              <div className="flex gap-5 py-2 w-full overflow-hidden">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="px-5 py-4 bg-white/80 rounded-xl border border-black/5 shadow-xs flex items-center gap-3.5 shrink-0 min-w-[220px] max-w-[280px] animate-pulse">
                    <div className="w-9 h-9 rounded-lg bg-slate-200 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 bg-slate-200 rounded w-24" />
                      <div className="h-2.5 bg-slate-100 rounded w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : marqueeItems.length === 0 ? (
              <div className="text-center py-6 text-slate-400 font-mono text-sm">No tech stack records found in database.</div>
            ) : (
              <div className={`flex gap-5 py-2 group ${isOverflowing ? "w-max animate-marquee" : "w-full justify-center items-center"}`}>
                {marqueeItems.map((stack, idx) => (
                  <div key={idx} className="px-5 py-4 bg-white rounded-xl border border-black/5 shadow-xs hover:shadow-md transition-all shrink-0 min-w-[220px] max-w-[280px] flex items-center gap-3.5">
                    {stack.icon_url ? (
                      <img src={stack.icon_url} alt={stack.label} className="w-9 h-9 object-contain rounded-lg p-1.5 bg-[#faf8ff] border border-black/5 shrink-0" onError={(e) => { e.target.style.display = "none"; }} />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-[#ebedfc] text-[#1F4BE0] font-mono font-bold text-[14px] flex items-center justify-center shrink-0">
                        {stack.label ? stack.label.charAt(0) : "T"}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-[14px] text-[#171b26] block truncate leading-snug">{stack.label}</span>
                      <span className="text-[12px] font-mono text-slate-400 block truncate leading-snug">{stack.sub || "Core Stack"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Client Reviews ── */}
      <section className="py-20 bg-[#faf8ff] border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Section header + Leave a Review button */}
          <RevealSection className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-[13px] font-mono font-bold uppercase tracking-wider text-[#1F4BE0] block mb-3">
              Engineering Leadership Reviews
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-[44px] font-extrabold text-[#171b26] tracking-tight leading-tight">
              Trusted by Technical Decision Makers
            </h2>
            <div className="mt-6 flex justify-center">
              <motion.button
                onClick={() => setShowReviewModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-[#E4E8F0] text-[#0B1020] text-[14px] font-semibold shadow-sm hover:border-[#1F4BE0] hover:text-[#1F4BE0] transition-colors"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <span className="material-symbols-outlined text-[18px]">rate_review</span>
                Leave a Review
              </motion.button>
            </div>
          </RevealSection>

          {/* Review Modal */}
          {showReviewModal && <ReviewModal onClose={() => setShowReviewModal(false)} />}

          {reviewsLoading ? (
            <div className="flex flex-wrap justify-center items-stretch gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-2xl p-7 border border-black/5 shadow-xs flex flex-col justify-between gap-6 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-[380px] shrink-0 animate-pulse">
                  <div className="space-y-4">
                    <div className="flex items-center gap-1.5">{[1, 2, 3, 4, 5].map(s => <div key={s} className="w-4 h-4 rounded bg-slate-200" />)}</div>
                    <div className="space-y-2 pt-2">
                      <div className="h-3.5 bg-slate-200 rounded w-full" /><div className="h-3.5 bg-slate-200 rounded w-11/12" /><div className="h-3.5 bg-slate-100 rounded w-3/4" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3.5 pt-3 border-t border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
                    <div className="flex-1 space-y-2"><div className="h-3 bg-slate-200 rounded w-28" /><div className="h-2.5 bg-slate-100 rounded w-36" /></div>
                  </div>
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 text-slate-400 font-mono text-sm">No client reviews found in database.</div>
          ) : (
            <ReviewsStaggered currentReviews={currentReviews} />
          )}

          {!reviewsLoading && reviews.length > 3 && (
            <div className="mt-12 flex items-center justify-center gap-6">
              <button onClick={prevReviewPage} className="w-9 h-9 rounded-full bg-white border border-black/10 text-[#171b26] hover:bg-[#ebedfc] hover:text-[#1F4BE0] flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95" aria-label="Previous Reviews">
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              </button>
              <div className="flex items-center gap-2.5">
                {reviews.map((_, idx) => (
                  <button key={idx} onClick={() => setReviewIndex(idx)}
                    className={`transition-all cursor-pointer ${reviewIndex === idx ? "w-7 h-2.5 rounded-full bg-[#EA580C] shadow-xs" : "w-2.5 h-2.5 rounded-full bg-slate-300 hover:bg-slate-400"}`}
                    aria-label={`Go to review position ${idx + 1}`} />
                ))}
              </div>
              <button onClick={nextReviewPage} className="w-9 h-9 rounded-full bg-[#1F4BE0] text-white hover:bg-[#1A3FC4] flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95" aria-label="Next Reviews">
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          )}

          {/* CTA Banner */}
          <RevealSection className="mt-16 md:mt-20" delay={0.1}>
            <div className="bg-[#1F4BE0] rounded-3xl p-8 md:p-14 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-[-60px] right-[-60px] w-[300px] h-[300px] rounded-full opacity-20" style={{ background: "radial-gradient(circle, #ffffff 0%, transparent 70%)" }} />
              </div>
              <div className="space-y-3 max-w-2xl z-10">
                <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
                  Ready to Architect Your Next Technical Breakthrough?
                </h3>
                <p className="text-[15px] md:text-[17px] text-blue-100/90 leading-relaxed font-normal">
                  Book a 45-minute technical discovery session directly with a Principal Cloud Systems Architect. No sales intermediaries — pure architecture, specs, and timeline estimation.
                </p>
              </div>
              <div className="z-10 shrink-0">
                <Link to="/schedule" className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#EA580C] hover:bg-[#ff7315] text-white font-extrabold text-[15px] shadow-lg transition-all hover:scale-[1.02] active:scale-95 cursor-pointer">
                  <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                  <span>Schedule Consultation</span>
                </Link>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Staggered reviews grid (separate component so useInView
   re-fires correctly when currentReviews changes)
───────────────────────────────────────────────────── */
function ReviewsStaggered({ currentReviews }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      className="flex flex-wrap justify-center items-stretch gap-6"
      variants={staggerContainer}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {currentReviews.map((rev) => (
        <motion.div
          key={rev._virtualKey || rev.id}
          className="bg-white rounded-2xl p-7 border border-black/5 shadow-xs flex flex-col justify-between gap-6 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-[380px] shrink-0"
          variants={cardVariant}
          whileHover={{ y: -4, boxShadow: "0 16px 30px -18px rgba(11,16,32,.28)", borderColor: "#C9D0E2" }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-1 text-[#EA580C]">
              {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                <span key={i} className="material-symbols-outlined text-[18px] fill-current">star</span>
              ))}
            </div>
            <p className="text-[14px] md:text-[15px] text-[#171b26] leading-relaxed font-normal">"{rev.quote}"</p>
          </div>
          <div className="flex items-center gap-3.5 pt-2 border-t border-slate-100">
            <div className="w-10 h-10 rounded-full bg-[#ebedfc] text-[#1F4BE0] font-bold text-[13px] flex items-center justify-center shrink-0 shadow-xs border border-[#1F4BE0]/10">
              {rev.initials || "CR"}
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-bold text-[14px] text-[#171b26] block truncate leading-snug">{rev.name}</span>
              <span className="text-[12px] text-slate-400 font-medium block truncate leading-snug">{rev.role}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}