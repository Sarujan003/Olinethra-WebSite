import { useEffect, useState } from "react";
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Field, inp } from "./adminUtils";

const DEFAULT_SERVICE = {
    id_code: "",
    category: "frontend",
    title: "",
    desc: "",
    caps: "",
    deliverables: "",
};

export default function ServicesManager() {
    const [services, setServices] = useState([]);
    const [svcForm, setSvcForm] = useState(DEFAULT_SERVICE);
    const [svcPanel, setSvcPanel] = useState("list"); // list | add
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        const unsub = onSnapshot(query(collection(db, "services"), orderBy("createdAt")), snap =>
            setServices(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        );
        return () => unsub();
    }, []);

    const saveService = async (e) => {
        e.preventDefault();
        const payload = {
            ...svcForm,
            caps: typeof svcForm.caps === "string" ? svcForm.caps.split(",").map(s => s.trim()).filter(Boolean) : svcForm.caps,
            deliverables: typeof svcForm.deliverables === "string" ? svcForm.deliverables.split(",").map(s => s.trim()).filter(Boolean) : svcForm.deliverables,
        };

        if (editId) {
            await updateDoc(doc(db, "services", editId), payload);
            setEditId(null);
        } else {
            await addDoc(collection(db, "services"), { ...payload, createdAt: Date.now() });
        }
        setSvcForm(DEFAULT_SERVICE);
        setSvcPanel("list");
    };

    const startEdit = (s) => {
        setSvcForm({
            id_code: s.id_code || "",
            category: s.category || "frontend",
            title: s.title || "",
            desc: s.desc || "",
            caps: Array.isArray(s.caps) ? s.caps.join(", ") : s.caps || "",
            deliverables: Array.isArray(s.deliverables) ? s.deliverables.join(", ") : s.deliverables || "",
        });
        setEditId(s.id);
        setSvcPanel("add");
    };

    const deleteService = async (id) => {
        if (!confirm("Delete this service?")) return;
        await deleteDoc(doc(db, "services", id));
    };

    return (
        <div className="max-w-4xl space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold">Services Manager</h2>
                <button
                    onClick={() => {
                        setSvcPanel(p => p === "add" ? "list" : "add");
                        setSvcForm(DEFAULT_SERVICE);
                        setEditId(null);
                    }}
                    className="px-4 py-2 bg-[#004fcb] text-white text-[13px] font-bold rounded-lg hover:bg-[#0265ff] transition"
                >
                    {svcPanel === "add" ? "← Back to List" : "+ Add Service"}
                </button>
            </div>

            {svcPanel === "add" && (
                <form onSubmit={saveService} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-black/5 space-y-4">
                    <h3 className="font-bold">{editId ? "Edit Service Entry" : "New Service Entry"}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field label="System ID Code" required>
                            <input
                                required
                                className={inp}
                                placeholder="SYS.05 // DATA_MESH"
                                value={svcForm.id_code}
                                onChange={e => setSvcForm({ ...svcForm, id_code: e.target.value })}
                            />
                        </Field>
                        <Field label="Category" required>
                            <select
                                required
                                className={inp}
                                value={svcForm.category}
                                onChange={e => setSvcForm({ ...svcForm, category: e.target.value })}
                            >
                                <option value="frontend">Frontend / React</option>
                                <option value="backend">Cloud Systems</option>
                                <option value="ai">Applied AI</option>
                                <option value="sre">SRE &amp; DevOps</option>
                            </select>
                        </Field>
                    </div>
                    <Field label="Service Title" required>
                        <input
                            required
                            className={inp}
                            placeholder="Data Mesh &amp; Lakehouse Architecture"
                            value={svcForm.title}
                            onChange={e => setSvcForm({ ...svcForm, title: e.target.value })}
                        />
                    </Field>
                    <Field label="Description" required>
                        <textarea
                            required
                            rows={3}
                            className={inp}
                            placeholder="What this service delivers..."
                            value={svcForm.desc}
                            onChange={e => setSvcForm({ ...svcForm, desc: e.target.value })}
                        />
                    </Field>
                    <Field label="Core Capabilities (comma separated)">
                        <input
                            className={inp}
                            placeholder="Feature 1, Feature 2, Feature 3, Feature 4"
                            value={svcForm.caps}
                            onChange={e => setSvcForm({ ...svcForm, caps: e.target.value })}
                        />
                    </Field>
                    <Field label="Deliverables (comma separated)">
                        <input
                            className={inp}
                            placeholder="Deliverable A, Deliverable B"
                            value={svcForm.deliverables}
                            onChange={e => setSvcForm({ ...svcForm, deliverables: e.target.value })}
                        />
                    </Field>
                    <button
                        type="submit"
                        className="w-full py-3 bg-[#004fcb] text-white font-bold rounded-lg hover:bg-[#0265ff] transition"
                    >
                        {editId ? "Save Changes" : "Publish Service"}
                    </button>
                </form>
            )}

            {svcPanel === "list" && (
                <div className="bg-white rounded-xl shadow-sm border border-black/5 overflow-hidden">
                    <div className="px-5 py-3 bg-[#f2f3ff]">
                        <span className="text-[12px] font-mono font-bold text-[#424656] uppercase">
                            Live Services ({services.length})
                        </span>
                    </div>
                    {services.length === 0 && (
                        <p className="p-6 text-[13px] text-slate-400 text-center">No services yet. Add one above.</p>
                    )}
                    <ul className="divide-y divide-black/5">
                        {services.map(s => (
                            <li key={s.id} className="flex items-start justify-between p-5 gap-4">
                                <div className="flex-1">
                                    <span className="text-[11px] font-mono bg-[#f2f3ff] px-2 py-0.5 rounded text-[#424656]">
                                        {s.id_code}
                                    </span>
                                    <h4 className="font-bold text-[15px] mt-1">{s.title}</h4>
                                    <p className="text-[13px] text-[#424656] mt-0.5 line-clamp-2">{s.desc}</p>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {(s.deliverables || []).map((d, i) => (
                                            <span key={i} className="px-2 py-0.5 rounded bg-[#ebedfc] text-[11px] font-mono text-[#004fcb]">
                                                {d}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => startEdit(s)}
                                        className="p-1.5 rounded-lg bg-[#ebedfc] text-[#004fcb] hover:bg-[#dfe2f1] transition"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                    </button>
                                    <button
                                        onClick={() => deleteService(s.id)}
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
