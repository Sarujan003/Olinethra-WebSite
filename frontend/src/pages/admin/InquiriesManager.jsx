import { useEffect, useState } from "react";

export default function InquiriesManager() {
    const [inquiries, setInquiries] = useState([]);

    useEffect(() => {
        fetch("/api/inquiries")
            .then(r => r.json())
            .then(d => { if (d.success) setInquiries(d.data); })
            .catch(() => { });
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-extrabold">Client Inquiries</h2>
            <div className="bg-white rounded-xl shadow-sm border border-black/5 overflow-x-auto">
                <table className="w-full text-left text-[13px]">
                    <thead className="bg-[#f2f3ff] text-[11px] uppercase font-mono text-[#424656]">
                        <tr>
                            <th className="p-4">Contact</th>
                            <th className="p-4">Company</th>
                            <th className="p-4">Budget</th>
                            <th className="p-4">Scope</th>
                            <th className="p-4">Brief</th>
                            <th className="p-4">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                        {inquiries.length === 0 && (
                            <tr><td colSpan={6} className="p-6 text-center text-slate-400">No inquiries received yet.</td></tr>
                        )}
                        {inquiries.map(inq => (
                            <tr key={inq.id} className="hover:bg-slate-50">
                                <td className="p-4 font-semibold">
                                    {inq.fullName}
                                    <span className="block text-[11px] font-normal text-[#424656]">{inq.email}</span>
                                </td>
                                <td className="p-4">
                                    {inq.company}
                                    {inq.website && (
                                        <a href={inq.website} target="_blank" rel="noreferrer"
                                            className="block text-[11px] text-[#004fcb]">{inq.website}</a>
                                    )}
                                </td>
                                <td className="p-4">
                                    <span className="px-2 py-1 rounded bg-[#ebedfc] text-[#004fcb] font-bold text-[11px]">{inq.budget}</span>
                                </td>
                                <td className="p-4 text-[12px] font-mono">{inq.scope}</td>
                                <td className="p-4 max-w-xs text-[12px] text-[#424656] truncate">{inq.brief}</td>
                                <td className="p-4 text-[11px] font-mono text-slate-400">
                                    {inq.created_at ? new Date(inq.created_at).toLocaleDateString() : "—"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
