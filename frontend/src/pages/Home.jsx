import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase";

const STATIC_STACKS = [];

export default function Home() {
  const [terminalTab, setTerminalTab] = useState("health");
  const [techStacks, setTechStacks] = useState(STATIC_STACKS);
  const [reviews, setReviews] = useState([]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [techLoading, setTechLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const containerRef = useRef(null);
  const singleTrackRef = useRef(null);

  useEffect(() => {
    let unsubTech = () => { };
    let unsubReviews = () => { };
    try {
      const qTech = query(collection(db, "techStacks"), orderBy("createdAt"));
      unsubTech = onSnapshot(
        qTech,
        snap => {
          if (!snap.empty) {
            setTechStacks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
          } else {
            setTechStacks([]);
          }
          setTechLoading(false);
        },
        err => {
          console.error("Firestore techStacks snapshot error:", err);
          setTechLoading(false);
        }
      );

      const qReviews = query(collection(db, "clientReviews"), orderBy("createdAt", "desc"));
      unsubReviews = onSnapshot(
        qReviews,
        snap => {
          if (!snap.empty) {
            setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() })));
          } else {
            setReviews([]);
          }
          setReviewsLoading(false);
        },
        err => {
          console.error("Firestore clientReviews snapshot error:", err);
          setReviewsLoading(false);
        }
      );
    } catch {
      setTechLoading(false);
      setReviewsLoading(false);
    }
    return () => {
      unsubTech();
      unsubReviews();
    };
  }, []);

  // Precise calculation: Compare exact card track width with available container width
  useEffect(() => {
    if (techLoading || techStacks.length === 0) return;

    const checkOverflow = () => {
      if (containerRef.current && singleTrackRef.current) {
        const style = window.getComputedStyle(containerRef.current);
        const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
        // Actual usable inner width
        const availableWidth = containerRef.current.clientWidth - padding;
        const totalTrackWidth = singleTrackRef.current.scrollWidth;

        // If items exceed available width, activate full-width circulating marquee
        setIsOverflowing(totalTrackWidth > availableWidth);
      }
    };

    // Run measurement on mount, font/image load, and resize
    checkOverflow();
    const timer = setTimeout(checkOverflow, 200);

    const resizeObserver = new ResizeObserver(checkOverflow);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    if (singleTrackRef.current) resizeObserver.observe(singleTrackRef.current);

    window.addEventListener("resize", checkOverflow);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      window.removeEventListener("resize", checkOverflow);
    };
  }, [techStacks, techLoading]);

  // Repeat items 4x when overflowing so wide screens never show empty gaps during the loop
  const marqueeItems = isOverflowing
    ? [...techStacks, ...techStacks, ...techStacks, ...techStacks]
    : techStacks;

  // Circular Reviews Carousel logic
  useEffect(() => {
    if (reviews.length > 0 && reviewIndex >= reviews.length) {
      setReviewIndex(0);
    }
  }, [reviews.length, reviewIndex]);

  const visibleCount = Math.min(3, reviews.length);
  const currentReviews = Array.from({ length: visibleCount }).map((_, i) => {
    const idx = (reviewIndex + i) % reviews.length;
    return { ...reviews[idx], _virtualKey: `${reviews[idx].id || idx}-${i}` };
  });

  const prevReviewPage = () => {
    setReviewIndex(prev => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const nextReviewPage = () => {
    setReviewIndex(prev => (prev + 1) % reviews.length);
  };

  return (
    <div className="bg-[#faf8ff] min-h-screen text-[#171b26]">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden pb-16 pt-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ebedfc] text-[12px] font-mono font-semibold text-[#171b26]">
              <span className="w-2 h-2 rounded-full bg-[#fe6a17] animate-pulse"></span>
              ENTERPRISE CLOUD ARCHITECTURE &amp; AI RUNTIME
            </span>
            <span className="hidden sm:inline text-[12px] font-mono text-slate-400">v2.4.0-stable</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 flex flex-col gap-6">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                Engineering Scalable Software &amp;{" "}
                <span className="bg-gradient-to-r from-[#004fcb] to-[#fe6a17] bg-clip-text text-transparent">
                  Intelligent Cloud Systems
                </span>{" "}
                for Ambitious Brands
              </h1>
              <p className="text-[18px] text-[#424656] max-w-2xl leading-relaxed">
                We architect next-generation web platforms, enterprise AI solutions, and distributed systems with uncompromising speed, security, and precision. Built for 99.999% reliability under extreme load.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to="/services" className="px-6 py-3 rounded-lg bg-[#004fcb] text-white font-semibold text-[14px] shadow-lg hover:bg-[#0265ff] transition-all flex items-center gap-2">
                  <span>Explore Services</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
                <Link to="/projects" className="px-6 py-3 rounded-lg bg-[#ebedfc] text-[#171b26] font-semibold text-[14px] hover:bg-[#dfe2f1] transition-colors flex items-center gap-2">
                  <span>View Case Studies</span>
                  <span className="material-symbols-outlined text-[18px]">terminal</span>
                </Link>
              </div>

              <div className="pt-4 flex flex-wrap gap-6 text-[13px] text-[#424656]">
                <span className="flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[#004fcb] text-[18px]">verified</span>
                  SOC-2 Type II Certified
                </span>
                <span className="flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[#fe6a17] text-[18px]">bolt</span>
                  &lt;250ms Global P99
                </span>
                <span className="flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[#006178] text-[18px]">cloud_sync</span>
                  40+ Multi-Region Nodes
                </span>
              </div>
            </div>

            {/* Right: Cloudinary Looping Video Visualizer */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-full aspect-[4/4.9] rounded-2xl overflow-hidden border border-black/10 shadow-2xl bg-white">
                <video
                  src="https://res.cloudinary.com/dc457saw0/video/upload/v1791293727/Home_page_Right_Image_Animaction.webm"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover scale-x-[1.28] scale-y-[1.38] origin-[22%_50%] pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-black/5 shadow-sm">
              <span className="text-[12px] font-mono text-[#424656] block mb-1">SERVICE GUARANTEE</span>
              <span className="text-3xl font-extrabold text-[#171b26]">99.99%</span>
              <span className="text-[13px] text-[#424656] block mt-1">Guaranteed SLA Uptime Target</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-black/5 shadow-sm">
              <span className="text-[12px] font-mono text-[#424656] block mb-1">EDGE DISPATCH</span>
              <span className="text-3xl font-extrabold text-[#fe6a17]">&lt;250ms</span>
              <span className="text-[13px] text-[#424656] block mt-1">Global P99 Worldwide Edge</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-black/5 shadow-sm">
              <span className="text-[12px] font-mono text-[#424656] block mb-1">DEPLOYMENTS</span>
              <span className="text-3xl font-extrabold text-[#171b26]">40+</span>
              <span className="text-[13px] text-[#424656] block mt-1">Fortune 1000 &amp; Scalers</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-black/5 shadow-sm">
              <span className="text-[12px] font-mono text-[#424656] block mb-1">COMPLIANCE</span>
              <span className="text-3xl font-extrabold text-[#171b26]">SOC-2</span>
              <span className="text-[13px] text-[#424656] block mt-1">Type II &amp; HIPAA Hardened</span>
            </div>
          </div>
        </div>
      </section>

      {/* Hidden container used to accurately measure 1 single set of cards */}
      <div
        className="invisible fixed top-0 left-0 pointer-events-none flex gap-5 w-max opacity-0"
        ref={singleTrackRef}
      >
        {techStacks.map((stack, idx) => (
          <div
            key={stack.id || idx}
            className="px-5 py-4 min-w-[220px] max-w-[280px] flex items-center gap-3.5 shrink-0"
          >
            <div className="w-9 h-9 shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="font-bold text-[14px] text-[#171b26] block truncate leading-snug">{stack.label}</span>
              <span className="text-[12px] font-mono text-slate-400 block truncate leading-snug">{stack.sub || "Core Stack"}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tech Stack Marquee (dynamic from Firestore) ── */}
      <section className="bg-[#f2f3ff] py-12 border-y border-black/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12" ref={containerRef}>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[12px] font-mono text-[#004fcb] font-bold uppercase">Core Infrastructure</span>
              <h2 className="text-2xl font-bold">Battle-Tested Modern Stack</h2>
            </div>
            <p className="text-[14px] text-[#424656]">Designed with zero legacy dependencies and clean architecture principles.</p>
          </div>

          {/* Marquee Track */}
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
                  <div
                    key={n}
                    className="px-5 py-4 bg-white/80 rounded-xl border border-black/5 shadow-xs flex items-center gap-3.5 shrink-0 min-w-[220px] max-w-[280px] animate-pulse"
                  >
                    <div className="w-9 h-9 rounded-lg bg-slate-200 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 bg-slate-200 rounded w-24" />
                      <div className="h-2.5 bg-slate-100 rounded w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : marqueeItems.length === 0 ? (
              <div className="text-center py-6 text-slate-400 font-mono text-sm">
                No tech stack records found in database.
              </div>
            ) : (
              <div
                className={`flex gap-5 py-2 group ${isOverflowing
                  ? "w-max animate-marquee hover:[animation-play-state:paused]"
                  : "w-full justify-center items-center"
                  }`}
              >
                {marqueeItems.map((stack, idx) => (
                  <div
                    key={idx}
                    className="px-5 py-4 bg-white rounded-xl border border-black/5 shadow-xs hover:shadow-md transition-all shrink-0 min-w-[220px] max-w-[280px] flex items-center gap-3.5"
                  >
                    {stack.icon_url ? (
                      <img
                        src={stack.icon_url}
                        alt={stack.label}
                        className="w-9 h-9 object-contain rounded-lg p-1.5 bg-[#faf8ff] border border-black/5 shrink-0"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-[#ebedfc] text-[#004fcb] font-mono font-bold text-[14px] flex items-center justify-center shrink-0">
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

        <style>{`
          @keyframes marquee {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
        `}</style>
      </section>

      {/* ── Client Reviews Section (Dynamic with Skeleton Loading) ── */}
      <section className="py-20 bg-[#faf8ff] border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-[13px] font-mono font-bold uppercase tracking-wider text-[#004fcb] block mb-3">
              ENGINEERING LEADERSHIP REVIEWS
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-[44px] font-extrabold text-[#171b26] tracking-tight leading-tight">
              Trusted by Technical Decision Makers
            </h2>
          </div>

          {/* Reviews Content: Skeleton loading -> Empty State -> Cards */}
          {reviewsLoading ? (
            <div className="flex flex-wrap justify-center items-stretch gap-6 transition-all duration-300">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-2xl p-7 border border-black/5 shadow-xs flex flex-col justify-between gap-6 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-[380px] shrink-0 animate-pulse"
                >
                  <div className="space-y-4">
                    {/* Skeleton Stars */}
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <div key={s} className="w-4 h-4 rounded bg-slate-200" />
                      ))}
                    </div>

                    {/* Skeleton Quote */}
                    <div className="space-y-2 pt-2">
                      <div className="h-3.5 bg-slate-200 rounded w-full" />
                      <div className="h-3.5 bg-slate-200 rounded w-11/12" />
                      <div className="h-3.5 bg-slate-100 rounded w-3/4" />
                    </div>
                  </div>

                  {/* Skeleton Author */}
                  <div className="flex items-center gap-3.5 pt-3 border-t border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-slate-200 rounded w-28" />
                      <div className="h-2.5 bg-slate-100 rounded w-36" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 text-slate-400 font-mono text-sm">
              No client reviews found in database.
            </div>
          ) : (
            <div className="flex flex-wrap justify-center items-stretch gap-6 transition-all duration-300">
              {currentReviews.map((rev) => (
                <div
                  key={rev._virtualKey || rev.id}
                  className="bg-white rounded-2xl p-7 border border-black/5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-6 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-[380px] shrink-0"
                >
                  <div className="space-y-4">
                    {/* Star Rating */}
                    <div className="flex items-center gap-1 text-[#fe6a17]">
                      {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-[18px] fill-current">
                          star
                        </span>
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-[14px] md:text-[15px] text-[#171b26] leading-relaxed font-normal">
                      "{rev.quote}"
                    </p>
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center gap-3.5 pt-2 border-t border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-[#ebedfc] text-[#004fcb] font-bold text-[13px] flex items-center justify-center shrink-0 shadow-xs border border-[#004fcb]/10">
                      {rev.initials || "CR"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-[14px] text-[#171b26] block truncate leading-snug">
                        {rev.name}
                      </span>
                      <span className="text-[12px] text-slate-400 font-medium block truncate leading-snug">
                        {rev.role}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Navigation Controls: Only rendered once loaded and when more than 3 reviews exist */}
          {!reviewsLoading && reviews.length > 3 && (
            <div className="mt-12 flex items-center justify-center gap-6">
              {/* Prev Arrow */}
              <button
                onClick={prevReviewPage}
                className="w-9 h-9 rounded-full bg-white border border-black/10 text-[#171b26] hover:bg-[#ebedfc] hover:text-[#004fcb] flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
                aria-label="Previous Reviews"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              </button>

              {/* Dot Indicators */}
              <div className="flex items-center gap-2.5">
                {reviews.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setReviewIndex(idx)}
                    className={`transition-all cursor-pointer ${reviewIndex === idx
                      ? "w-7 h-2.5 rounded-full bg-[#fe6a17] shadow-xs"
                      : "w-2.5 h-2.5 rounded-full bg-slate-300 hover:bg-slate-400"
                      }`}
                    aria-label={`Go to review position ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Next Arrow */}
              <button
                onClick={nextReviewPage}
                className="w-9 h-9 rounded-full bg-[#004fcb] text-white hover:bg-[#0265ff] flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95"
                aria-label="Next Reviews"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          )}

          {/* Technical Breakthrough CTA Banner */}
          <div className="mt-16 md:mt-20">
            <div className="bg-[#004fcb] rounded-3xl p-8 md:p-14 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden">
              <div className="space-y-3 max-w-2xl z-10">
                <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
                  Ready to Architect Your Next Technical Breakthrough?
                </h3>
                <p className="text-[15px] md:text-[17px] text-blue-100/90 leading-relaxed font-normal">
                  Book a 45-minute technical discovery session directly with a Principal Cloud Systems Architect. No sales intermediaries — pure architecture, specs, and timeline estimation.
                </p>
              </div>
              <div className="z-10 shrink-0">
                <Link
                  to="/schedule"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#ff5e00] hover:bg-[#ff7315] text-white font-extrabold text-[15px] shadow-lg hover:shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                  <span>Schedule Consultation</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}