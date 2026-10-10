import { useEffect, useState } from "react";
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Field, inp } from "./adminUtils";

const DEFAULT_REVIEW = {
    name: "",
    role: "",
    quote: "",
    rating: 5,
    initials: "",
    status: "approved"
};

export default function ClientReviewsManager() {
    const [reviews, setReviews] = useState([]);
    const [reviewForm, setReviewForm] = useState(DEFAULT_REVIEW);
    const [panel, setPanel] = useState("list"); // list | add
    const [editId, setEditId] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all"); // all | pending | approved | hidden

    useEffect(() => {
        let unsub = () => { };
        try {
            const q = query(collection(db, "clientReviews"), orderBy("createdAt", "desc"));
            unsub = onSnapshot(q, snap => {
                setReviews(snap.docs.map(d => {
                    const data = d.data();
                    return {
                        id: d.id,
                        ...data,
                        status: data.status || "approved" // Fallback legacy reviews to approved
                    };
                }));
            });
        } catch (err) {
            console.error("Firestore clientReviews error:", err);
        }
        return () => unsub();
    }, []);

    const saveReview = async (e) => {
        e.preventDefault();
        if (!reviewForm.name.trim() || !reviewForm.quote.trim()) return;

        let initials = reviewForm.initials.trim();
        if (!initials) {
            const parts = reviewForm.name.trim().split(" ");
            initials = parts.length > 1
                ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
                : parts[0].slice(0, 2).toUpperCase();
        }

        const payload = {
            ...reviewForm,
            rating: Number(reviewForm.rating) || 5,
            initials: initials,
            status: reviewForm.status || "approved"
        };

        if (editId) {
            await updateDoc(doc(db, "clientReviews", editId), payload);
            setEditId(null);
        } else {
            await addDoc(collection(db, "clientReviews"), {
                ...payload,
                createdAt: Date.now()
            });
        }
        setReviewForm(DEFAULT_REVIEW);
        setPanel("list");
    };

    const startEdit = (r) => {
        setReviewForm({
            name: r.name || "",
            role: r.role || "",
            quote: r.quote || "",
            rating: r.rating || 5,
            initials: r.initials || "",
            status: r.status || "approved"
        });
        setEditId(r.id);
        setPanel("add");
    };

    const updateStatus = async (id, status) => {
        await updateDoc(doc(db, "clientReviews", id), { status });
    };

    const deleteReview = async (id) => {
        if (!confirm("Delete this client review permanently?")) return;
        await deleteDoc(doc(db, "clientReviews", id));
    };

    const filteredReviews = filterStatus === "all"
        ? reviews
        : reviews.filter(r => (r.status || "approved") === filterStatus);

    const countPending = reviews.filter(r => r.status === "pending").length;
    const countApproved = reviews.filter(r => (r.status || "approved") === "approved").length;
    const countHidden = reviews.filter(r => r.status === "hidden").length;

    return (
        <div className="max-w-4xl space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-extrabold">Client Reviews Manager</h2>
                    <p className="text-[13px] text-[#424656] mt-0.5">
                        Moderate client submissions and manage testimonials displayed on the homepage.
                    </p>
                </div>
                <button
                    onClick={() => {
                        setPanel(p => p === "add" ? "list" : "add");
                        setReviewForm(DEFAULT_REVIEW);
                        setEditId(null);
                    }}
                    className="px-4 py-2 bg-[#1F4BE0] text-white text-[13px] font-bold rounded-lg hover:bg-[#1A3FC4] transition shrink-0 ml-4 cursor-pointer"
                >
                    {panel === "add" ? "← Back to List" : "+ Add Client Review"}
                </button>
            </div>

            {/* Filter Tabs */}
            {panel === "list" && (
                <div className="flex items-center gap-2 border-b border-black/5 pb-3 overflow-x-auto">
                    {[
                        { id: "all", label: `All Reviews (${reviews.length})` },
                        { id: "pending", label: `Pending Approval (${countPending})`, badge: countPending > 0 ? "bg-amber-500 text-white" : null },
                        { id: "approved", label: `Approved / Published (${countApproved})` },
                        { id: "hidden", label: `Hidden (${countHidden})` },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setFilterStatus(tab.id)}
                            className={`px-3.5 py-1.5 rounded-lg text-[13px] font-bold transition flex items-center gap-2 cursor-pointer ${filterStatus === tab.id
                                ? "bg-[#1F4BE0] text-white shadow-xs"
                                : "bg-white text-[#424656] hover:bg-slate-100 border border-black/5"
                                }`}
                        >
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Add / Edit Form */}
            {panel === "add" && (
                <form onSubmit={saveReview} className="bg-white rounded-xl p-5 shadow-sm border border-black/5 space-y-4">
                    <h3 className="font-bold text-[14px]">{editId ? "Edit Review" : "Add New Client Review"}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Client Name" required>
                            <input
                                required
                                className={inp}
                                placeholder="e.g. Marcus Reynolds"
                                value={reviewForm.name}
                                onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })}
                            />
                        </Field>
                        <Field label="Role & Company">
                            <input
                                className={inp}
                                placeholder="e.g. VP of Infrastructure, Horizon Fin"
                                value={reviewForm.role}
                                onChange={e => setReviewForm({ ...reviewForm, role: e.target.value })}
                            />
                        </Field>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Field label="Rating (1 to 5 Stars)">
                            <select
                                className={inp}
                                value={reviewForm.rating}
                                onChange={e => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                            >
                                <option value={5}>5 Stars ★★★★★</option>
                                <option value={4}>4 Stars ★★★★☆</option>
                                <option value={3}>3 Stars ★★★☆☆</option>
                                <option value={2}>2 Stars ★★☆☆☆</option>
                                <option value={1}>1 Star ★☆☆☆☆</option>
                            </select>
                        </Field>
                        <Field label="Badge Initials (Optional)">
                            <input
                                className={inp}
                                placeholder="e.g. MR"
                                maxLength={3}
                                value={reviewForm.initials}
                                onChange={e => setReviewForm({ ...reviewForm, initials: e.target.value.toUpperCase() })}
                            />
                        </Field>
                        <Field label="Status">
                            <select
                                className={inp}
                                value={reviewForm.status}
                                onChange={e => setReviewForm({ ...reviewForm, status: e.target.value })}
                            >
                                <option value="approved">Approved (Visible on Website)</option>
                                <option value="pending">Pending Approval</option>
                                <option value="hidden">Hidden (Internal Only)</option>
                            </select>
                        </Field>
                    </div>

                    <Field label="Review / Testimonial Quote" required>
                        <textarea
                            required
                            rows={3}
                            className={inp}
                            placeholder="e.g. Olinethra's distributed systems group shaved 80ms off our global P99..."
                            value={reviewForm.quote}
                            onChange={e => setReviewForm({ ...reviewForm, quote: e.target.value })}
                        />
                    </Field>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => { setPanel("list"); setEditId(null); }}
                            className="px-4 py-2 border border-slate-200 text-slate-600 text-[13px] font-semibold rounded-lg hover:bg-slate-50 transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 bg-[#1F4BE0] text-white text-[13px] font-bold rounded-lg hover:bg-[#1A3FC4] transition cursor-pointer"
                        >
                            {editId ? "Save Changes" : "Create Review"}
                        </button>
                    </div>
                </form>
            )}

            {/* List */}
            {panel === "list" && (
                <div className="bg-white rounded-xl shadow-sm border border-black/5 overflow-hidden">
                    <div className="px-5 py-3 bg-[#f2f3ff] flex items-center justify-between">
                        <span className="text-[12px] font-mono font-bold text-[#424656] uppercase">
                            Reviews ({filteredReviews.length})
                        </span>
                    </div>
                    {filteredReviews.length === 0 ? (
                        <p className="p-6 text-[13px] text-slate-400 text-center">
                            No client reviews match this status.
                        </p>
                    ) : (
                        <ul className="divide-y divide-black/5">
                            {filteredReviews.map(r => {
                                const st = r.status || "approved";
                                return (
                                    <li key={r.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-start gap-3.5 flex-1">
                                            <div className="w-10 h-10 rounded-full bg-[#ebedfc] text-[#1F4BE0] font-bold text-sm flex items-center justify-center shrink-0">
                                                {r.initials || "CR"}
                                            </div>
                                            <div className="space-y-1 flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-bold text-[15px] text-[#171b26]">{r.name}</span>
                                                    <span className="text-[12px] text-amber-500 font-bold">
                                                        {"★".repeat(r.rating || 5)}
                                                    </span>

                                                    {/* Status Badge */}
                                                    {st === "approved" && (
                                                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold inline-flex items-center gap-1">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                            Approved
                                                        </span>
                                                    )}
                                                    {st === "pending" && (
                                                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold inline-flex items-center gap-1">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                                            Pending Review
                                                        </span>
                                                    )}
                                                    {st === "hidden" && (
                                                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[11px] font-bold inline-flex items-center gap-1">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                                            Hidden
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[13px] text-slate-600 italic">"{r.quote}"</p>
                                                <span className="text-[12px] font-medium text-slate-400 block">{r.role}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                                            {st !== "approved" && (
                                                <button
                                                    onClick={() => updateStatus(r.id, "approved")}
                                                    className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-[12px] transition cursor-pointer flex items-center gap-1"
                                                    title="Approve & Show on Website"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                                    Approve
                                                </button>
                                            )}
                                            {st === "approved" && (
                                                <button
                                                    onClick={() => updateStatus(r.id, "hidden")}
                                                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold text-[12px] transition cursor-pointer flex items-center gap-1"
                                                    title="Hide from Website"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">visibility_off</span>
                                                    Hide
                                                </button>
                                            )}
                                            <button
                                                onClick={() => startEdit(r)}
                                                className="p-1.5 rounded-lg bg-[#ebedfc] text-[#1F4BE0] hover:bg-[#dfe2f1] transition cursor-pointer"
                                                title="Edit Review"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                            </button>
                                            <button
                                                onClick={() => deleteReview(r.id)}
                                                className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition cursor-pointer"
                                                title="Delete Review"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
