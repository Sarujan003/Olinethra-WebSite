import { useEffect, useState } from "react";
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Field, inp } from "./adminUtils";

const DEFAULT_TECH = { label: "", sub: "", icon_url: "" };

export default function TechStackManager() {
    const [techStacks, setTechStacks] = useState([]);
    const [techForm, setTechForm] = useState(DEFAULT_TECH);
    const [techPanel, setTechPanel] = useState("list"); // list | add
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        const unsub = onSnapshot(query(collection(db, "techStacks"), orderBy("createdAt")), snap =>
            setTechStacks(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        );
        return () => unsub();
    }, []);

    const saveTech = async (e) => {
        e.preventDefault();
        if (!techForm.label.trim()) return;

        if (editId) {
            await updateDoc(doc(db, "techStacks", editId), techForm);
            setEditId(null);
        } else {
            await addDoc(collection(db, "techStacks"), { ...techForm, createdAt: Date.now() });
        }
        setTechForm(DEFAULT_TECH);
        setTechPanel("list");
    };

    const startEdit = (t) => {
        setTechForm({
            label: t.label || "",
            sub: t.sub || "",
            icon_url: t.icon_url || "",
        });
        setEditId(t.id);
        setTechPanel("add");
    };

    const deleteTech = async (id) => {
        if (!confirm("Delete this tech stack entry?")) return;
        await deleteDoc(doc(db, "techStacks", id));
    };

    return (
        <div className="max-w-3xl space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-extrabold">Tech Stack Manager</h2>
                    <p className="text-[13px] text-[#424656] mt-0.5">
                        Entries added here will appear in the auto-scrolling "Battle-Tested Modern Stack" marquee on the Home page.
                    </p>
                </div>
                <button
                    onClick={() => {
                        setTechPanel(p => p === "add" ? "list" : "add");
                        setTechForm(DEFAULT_TECH);
                        setEditId(null);
                    }}
                    className="px-4 py-2 bg-[#004fcb] text-white text-[13px] font-bold rounded-lg hover:bg-[#0265ff] transition shrink-0 ml-4"
                >
                    {techPanel === "add" ? "← Back to List" : "+ Add Tech Entry"}
                </button>
            </div>

            {/* Add / Edit Form */}
            {techPanel === "add" && (
                <form onSubmit={saveTech} className="bg-white rounded-xl p-5 shadow-sm border border-black/5 space-y-4">
                    <h3 className="font-bold text-[14px]">{editId ? "Edit Tech Entry" : "Add New Tech Entry"}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Field label="Technology Name" required>
                            <input
                                required
                                className={inp}
                                placeholder="React / Vite"
                                value={techForm.label}
                                onChange={e => setTechForm({ ...techForm, label: e.target.value })}
                            />
                        </Field>
                        <Field label="Subtitle / Description">
                            <input
                                className={inp}
                                placeholder="Turbopack Bundler"
                                value={techForm.sub}
                                onChange={e => setTechForm({ ...techForm, sub: e.target.value })}
                            />
                        </Field>
                        <Field label="Icon URL (SVG / Image)">
                            <input
                                className={inp}
                                placeholder="https://.../react.svg"
                                value={techForm.icon_url}
                                onChange={e => setTechForm({ ...techForm, icon_url: e.target.value })}
                            />
                        </Field>
                    </div>
                    <button className="px-5 py-2.5 bg-[#004fcb] text-white text-[13px] font-bold rounded-lg hover:bg-[#0265ff] transition">
                        {editId ? "Save Changes" : "+ Add Tech Entry"}
                    </button>
                </form>
            )}

            {/* List */}
            {techPanel === "list" && (
                <div className="bg-white rounded-xl shadow-sm border border-black/5 overflow-hidden">
                    <div className="px-5 py-3 bg-[#f2f3ff] flex items-center justify-between">
                        <span className="text-[12px] font-mono font-bold text-[#424656] uppercase">
                            Live Entries ({techStacks.length})
                        </span>
                    </div>
                    {techStacks.length === 0 && (
                        <p className="p-6 text-[13px] text-slate-400 text-center">No entries yet. Add one above.</p>
                    )}
                    <ul className="divide-y divide-black/5">
                        {techStacks.map(t => (
                            <li key={t.id} className="flex items-center justify-between px-5 py-3 gap-4">
                                <div className="flex items-center gap-3">
                                    {t.icon_url && (
                                        <img
                                            src={t.icon_url}
                                            alt={t.label}
                                            className="w-8 h-8 object-contain rounded p-1 bg-slate-50 border border-black/5"
                                        />
                                    )}
                                    <div>
                                        <span className="font-bold text-[14px]">{t.label}</span>
                                        <span className="block text-[11px] font-mono text-slate-400">{t.sub}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => startEdit(t)}
                                        className="p-1.5 rounded-lg bg-[#ebedfc] text-[#004fcb] hover:bg-[#dfe2f1] transition"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                    </button>
                                    <button
                                        onClick={() => deleteTech(t.id)}
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
