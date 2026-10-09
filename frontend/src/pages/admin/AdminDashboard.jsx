import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function AdminDashboard() {
    const [techStacks, setTechStacks] = useState([]);
    const [services, setServices] = useState([]);
    const [projects, setProjects] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [inquiries, setInquiries] = useState([]);

    useEffect(() => {
        const unsubs = [
            onSnapshot(query(collection(db, "techStacks")), snap =>
                setTechStacks(snap.docs.map(d => ({ id: d.id, ...d.data() })))),
            onSnapshot(query(collection(db, "services")), snap =>
                setServices(snap.docs.map(d => ({ id: d.id, ...d.data() })))),
            onSnapshot(query(collection(db, "projects")), snap =>
                setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })))),
            onSnapshot(query(collection(db, "clientReviews")), snap =>
                setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() })))),
        ];
        return () => unsubs.forEach(u => u());
    }, []);

    useEffect(() => {
        fetch("/api/inquiries")
            .then(r => r.json())
            .then(d => { if (d.success) setInquiries(d.data); })
            .catch(() => { });
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-extrabold mb-6">Olinethra Operations Mesh</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                {[
                    { label: "Tech Stacks", count: techStacks.length, icon: "layers", color: "#004fcb" },
                    { label: "Services", count: services.length, icon: "category", color: "#fe6a17" },
                    { label: "Projects", count: projects.length, icon: "folder_open", color: "#006178" },
                    { label: "Client Reviews", count: reviews.length, icon: "rate_review", color: "#10b981" },
                    { label: "Inquiries", count: inquiries.length, icon: "mail", color: "#7c3aed" },
                ].map(s => (
                    <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm border border-black/5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                            style={{ background: s.color }}>
                            <span className="material-symbols-outlined text-[24px]">{s.icon}</span>
                        </div>
                        <div>
                            <span className="text-3xl font-extrabold text-[#171b26]">{s.count}</span>
                            <span className="block text-[12px] text-slate-400 font-medium">{s.label}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
