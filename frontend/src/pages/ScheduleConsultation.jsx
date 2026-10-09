import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect, useState } from "react";

// Get Cal.com link from environment variables (defaults to 'olinethra/30min' if not set)
const CAL_LINK = import.meta.env.VITE_CAL_LINK || "olinethra/30min";

export default function ScheduleConsultation({ calLink = CAL_LINK }) {
    const [openFaq, setOpenFaq] = useState(null);

    useEffect(() => {
        (async function () {
            const cal = await getCalApi({ namespace: "30min" });
            cal("ui", {
                theme: "light",
                styles: { branding: { brandColor: "#004fcb" } },
                hideEventTypeDetails: false,
                layout: "month_view"
            });
        })();
    }, []);

    const faqs = [
        {
            q: "What can I expect during the 30-minute consultation?",
            a: "We review your current technical architecture, project scope, timeline, and key requirements. Our engineering director will provide strategic guidance, stack recommendations, and potential engagement paths."
        },
        {
            q: "Is there any cost or commitment attached?",
            a: "No. The initial technical discovery session is completely free with no obligation to proceed."
        },
        {
            q: "Can we sign an NDA prior to the call?",
            a: "Absolutely. If required, we can execute a mutual Non-Disclosure Agreement (NDA) before discussing proprietary business logic or code."
        },
        {
            q: "Who from Olinethra will be on the call?",
            a: "You'll meet directly with one of our Principal Software Architects or Engineering Directors—not a sales agent."
        }
    ];

    return (
        <div className="bg-[#faf8ff] min-h-screen text-[#171b26]">
            <main className="pt-28 pb-20 max-w-7xl mx-auto px-6 md:px-12">
                {/* Hero Header Section */}
                <div className="flex flex-col items-start gap-4 mb-10 max-w-4xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ebedfc] text-[12px] font-mono font-semibold text-[#004fcb]">
                        <span className="w-2 h-2 rounded-full bg-[#fe6a17] animate-pulse"></span>
                        FREE TECHNICAL DISCOVERY SESSION
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-[#0f172a]">
                        Schedule A Strategy Session{" "}
                        <span className="bg-linear-to-r from-[#004fcb] to-[#fe6a17] bg-clip-text text-transparent">
                            — Free &amp; Zero Commitment
                        </span>
                    </h1>
                    <p className="text-[16px] md:text-[18px] text-[#475569] leading-relaxed max-w-2xl">
                        Share your engineering goals or system challenges. Discover how our cloud architects and AI engineers can help build your vision with enterprise speed and precision.
                    </p>
                </div>

                {/* Trust Highlights / Value Props Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                    <div className="p-4 bg-white rounded-xl border border-black/5 shadow-xs flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#f2f3ff] text-[#004fcb] flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[22px]">verified_user</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-[14px]">Mutual NDA Ready</h4>
                            <p className="text-[12px] text-[#424656]">100% confidential technical discussion</p>
                        </div>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-black/5 shadow-xs flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#ffdbcd] text-[#fe6a17] flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[22px]">engineering</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-[14px]">Engineering-Led</h4>
                            <p className="text-[12px] text-[#424656]">Speak directly with Principal Architects</p>
                        </div>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-black/5 shadow-xs flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#e6f4f8] text-[#006178] flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[22px]">speed</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-[14px]">30-Min Roadmap</h4>
                            <p className="text-[12px] text-[#424656]">Receive actionable architecture advice</p>
                        </div>
                    </div>
                </div>

                {/* Cal.com Embedded Widget Container */}
                <div className="bg-white rounded-2xl p-4 md:p-8 shadow-sm border border-slate-200/80 min-h-[680px] overflow-hidden mb-16">
                    <Cal
                        namespace="30min"
                        calLink={calLink}
                        style={{ width: "100%", height: "100%", minHeight: "650px" }}
                        config={{ layout: "month_view", theme: "light" }}
                    />
                </div>

                {/* FAQ Section */}
                <div className="max-w-4xl mx-auto bg-white p-6 md:p-10 rounded-2xl border border-black/5 shadow-sm">
                    <div className="text-center mb-8">
                        <span className="text-[12px] font-mono text-[#004fcb] uppercase font-bold tracking-wider block mb-1">
                            Frequently Asked Questions
                        </span>
                        <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a]">
                            Have Questions Before Booking?
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className="border border-slate-100 rounded-xl overflow-hidden transition-all bg-[#faf8ff]"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full p-4 text-left font-semibold text-[15px] flex justify-between items-center text-[#171b26] hover:text-[#004fcb] transition-colors"
                                >
                                    <span>{faq.q}</span>
                                    <span className="material-symbols-outlined text-[20px] transition-transform duration-200" style={{ transform: openFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                        expand_more
                                    </span>
                                </button>
                                {openFaq === idx && (
                                    <div className="px-4 pb-4 text-[14px] text-[#424656] leading-relaxed border-t border-slate-100 pt-3 bg-white">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
