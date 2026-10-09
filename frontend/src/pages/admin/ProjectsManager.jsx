import { useEffect, useRef, useState } from "react";
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Field, inp, uploadToCloudinary } from "./adminUtils";

const DEFAULT_PROJECT = {
    title: "",
    category: "fintech",
    client: "",
    tag: "",
    badge: "FINTECH & HFT",
    summary: "",
    brief: "",
    challenge: "",
    metric1_label: "Throughput",
    metric1_val: "+320%",
    metric2_label: "Latency",
    metric2_val: "0.8ms P99",
    technologies: "",
    image_url: "",
};

export default function ProjectsManager() {
    const [projects, setProjects] = useState([]);
    const [projForm, setProjForm] = useState(DEFAULT_PROJECT);
    const [projPanel, setProjPanel] = useState("list"); // list | add
    const [uploading, setUploading] = useState(false);
    const [editId, setEditId] = useState(null);
    const fileRef = useRef();

    useEffect(() => {
        const unsub = onSnapshot(query(collection(db, "projects"), orderBy("createdAt", "desc")), snap =>
            setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        );
        return () => unsub();
    }, []);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const url = await uploadToCloudinary(file);
            setProjForm(f => ({ ...f, image_url: url }));
        } catch {
            alert("Image upload failed. Check Cloudinary credentials in .env");
        } finally {
            setUploading(false);
        }
    };

    const saveProject = async (e) => {
        e.preventDefault();
        const payload = {
            ...projForm,
            technologies: typeof projForm.technologies === "string"
                ? projForm.technologies.split(",").map(s => s.trim()).filter(Boolean)
                : projForm.technologies,
        };
        if (editId) {
            await updateDoc(doc(db, "projects", editId), payload);
            setEditId(null);
        } else {
            await addDoc(collection(db, "projects"), { ...payload, createdAt: Date.now() });
        }
        setProjForm(DEFAULT_PROJECT);
        setProjPanel("list");
    };

    const startEdit = (p) => {
        setProjForm({
            ...p,
            technologies: Array.isArray(p.technologies) ? p.technologies.join(", ") : p.technologies || "",
        });
        setEditId(p.id);
        setProjPanel("add");
    };

    const deleteProject = async (id) => {
        if (!confirm("Delete this project?")) return;
        await deleteDoc(doc(db, "projects", id));
    };

    return (
        <div className="max-w-5xl space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold">Projects / Case Studies</h2>
                <button
                    onClick={() => {
                        setProjPanel(p => p === "add" ? "list" : "add");
                        setProjForm(DEFAULT_PROJECT);
                        setEditId(null);
                    }}
                    className="px-4 py-2 bg-[#004fcb] text-white text-[13px] font-bold rounded-lg hover:bg-[#0265ff] transition"
                >
                    {projPanel === "add" ? "← Back to List" : "+ Add Project"}
                </button>
            </div>

            {projPanel === "add" && (
                <form onSubmit={saveProject} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-black/5 space-y-4">
                    <h3 className="font-bold">{editId ? "Edit Project" : "New Case Study"}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Project Title" required>
                            <input
                                required
                                className={inp}
                                placeholder="FinScale Global"
                                value={projForm.title}
                                onChange={e => setProjForm({ ...projForm, title: e.target.value })}
                            />
                        </Field>
                        <Field label="Top Badge Tag (e.g. FINTECH & HFT)" required>
                            <input
                                required
                                className={inp}
                                placeholder="FINTECH & HFT"
                                value={projForm.badge}
                                onChange={e => setProjForm({ ...projForm, badge: e.target.value.toUpperCase() })}
                            />
                        </Field>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="Client Name">
                            <input
                                className={inp}
                                placeholder="ACME Corp"
                                value={projForm.client}
                                onChange={e => setProjForm({ ...projForm, client: e.target.value })}
                            />
                        </Field>
                        <Field label="Category Group">
                            <select
                                className={inp}
                                value={projForm.category}
                                onChange={e => setProjForm({ ...projForm, category: e.target.value })}
                            >
                                <option value="fintech">Fintech &amp; HFT</option>
                                <option value="ai">Healthcare &amp; AI</option>
                                <option value="cloud">Supply Chain &amp; ML</option>
                                <option value="saas">Enterprise SaaS</option>
                            </select>
                        </Field>
                    </div>
                    <Field label="Executive Summary Paragraph" required>
                        <textarea
                            required
                            rows={2}
                            className={inp}
                            placeholder="Sub-millisecond data feeds and algorithmic order processing..."
                            value={projForm.summary}
                            onChange={e => setProjForm({ ...projForm, summary: e.target.value })}
                        />
                    </Field>
                    <Field label="Architecture Brief (Detailed Paragraph given by Admin)" required>
                        <textarea
                            required
                            rows={4}
                            className={inp}
                            placeholder="Full detailed architecture brief description for when users click Inspect Architecture Brief..."
                            value={projForm.brief || projForm.challenge}
                            onChange={e => setProjForm({ ...projForm, brief: e.target.value, challenge: e.target.value })}
                        />
                    </Field>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <Field label="KPI 1 Label">
                            <input
                                className={inp}
                                value={projForm.metric1_label}
                                onChange={e => setProjForm({ ...projForm, metric1_label: e.target.value })}
                            />
                        </Field>
                        <Field label="KPI 1 Value">
                            <input
                                className={inp}
                                value={projForm.metric1_val}
                                onChange={e => setProjForm({ ...projForm, metric1_val: e.target.value })}
                            />
                        </Field>
                        <Field label="KPI 2 Label">
                            <input
                                className={inp}
                                value={projForm.metric2_label}
                                onChange={e => setProjForm({ ...projForm, metric2_label: e.target.value })}
                            />
                        </Field>
                        <Field label="KPI 2 Value">
                            <input
                                className={inp}
                                value={projForm.metric2_val}
                                onChange={e => setProjForm({ ...projForm, metric2_val: e.target.value })}
                            />
                        </Field>
                    </div>
                    <Field label="Technologies (comma separated)">
                        <input
                            className={inp}
                            placeholder="Go, Kafka, Docker, Redis"
                            value={projForm.technologies}
                            onChange={e => setProjForm({ ...projForm, technologies: e.target.value })}
                        />
                    </Field>

                    {/* Cover image upload */}
                    <Field label="Cover Image">
                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={() => fileRef.current?.click()}
                                className="px-4 py-2 rounded-lg border-2 border-dashed border-[#004fcb]/40 text-[13px] text-[#004fcb] font-semibold hover:bg-[#f2f3ff] transition flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[18px]">upload</span>
                                {uploading ? "Uploading…" : "Upload from device"}
                            </button>
                            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            {projForm.image_url && (
                                <img
                                    src={projForm.image_url}
                                    alt="preview"
                                    className="h-12 w-20 object-cover rounded-lg border border-black/10"
                                />
                            )}
                        </div>
                        <input
                            className={`${inp} mt-2`}
                            type="url"
                            placeholder="Or paste image URL…"
                            value={projForm.image_url}
                            onChange={e => setProjForm({ ...projForm, image_url: e.target.value })}
                        />
                    </Field>

                    <button
                        type="submit"
                        disabled={uploading}
                        className="w-full py-3 bg-[#004fcb] text-white font-bold rounded-lg hover:bg-[#0265ff] transition disabled:opacity-50"
                    >
                        {editId ? "Save Changes" : "Publish to Live Portal"}
                    </button>
                </form>
            )}

            {projPanel === "list" && (
                <div className="bg-white rounded-xl shadow-sm border border-black/5 overflow-hidden">
                    <div className="px-5 py-3 bg-[#f2f3ff]">
                        <span className="text-[12px] font-mono font-bold text-[#424656] uppercase">
                            Live Projects ({projects.length})
                        </span>
                    </div>
                    {projects.length === 0 && (
                        <p className="p-6 text-[13px] text-slate-400 text-center">No projects yet. Add one above.</p>
                    )}
                    <ul className="divide-y divide-black/5">
                        {projects.map(p => (
                            <li key={p.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4">
                                <img
                                    src={p.image_url || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=200&q=60"}
                                    alt={p.title}
                                    className="w-full sm:w-20 h-32 sm:h-14 object-cover rounded-lg border border-black/10 shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <span className="font-bold text-[14px] block truncate">{p.title}</span>
                                    <span className="text-[12px] text-slate-400 font-mono uppercase">{p.category} · {p.client}</span>
                                    <p className="text-[12px] text-[#424656] mt-0.5 line-clamp-1">{p.summary}</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                    <button
                                        onClick={() => startEdit(p)}
                                        className="p-1.5 rounded-lg bg-[#ebedfc] text-[#004fcb] hover:bg-[#dfe2f1] transition"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                    </button>
                                    <button
                                        onClick={() => deleteProject(p.id)}
                                        className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
