"use client";
import { useEffect, useState } from "react";
export default function AdminInquiriesPage() {
  const [items, setItems] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  async function load() { setLoading(true); const response = await fetch("/api/contact"); const data = await response.json(); setItems(data.inquiries ?? []); setLoading(false); }
  useEffect(() => { load(); }, []);
  async function update(id: string, status: string) { await fetch(`/api/contact/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }); load(); }
  return <div><h1 className="text-2xl font-bold">Contact enquiries</h1>{loading ? <p className="mt-6">Loading…</p> : <div className="mt-6 space-y-4">{items.map(item => <article key={item._id} className="rounded-xl border p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-semibold">{item.name}</h2><a className="text-sm text-primary" href={`mailto:${item.email}`}>{item.email}</a>{item.phone && <p className="text-sm">{item.phone}</p>}</div><select value={item.status} onChange={e => update(item._id, e.target.value)} className="rounded border px-3 py-2 text-sm"><option value="new">New</option><option value="contacted">Contacted</option><option value="closed">Closed</option></select></div>{item.company && <p className="mt-3 text-sm"><strong>Company:</strong> {item.company}</p>}{item.service && <p className="text-sm"><strong>Service:</strong> {item.service}</p>}<p className="mt-3 whitespace-pre-line text-gray-700">{item.message}</p><time className="mt-3 block text-xs text-gray-500">{new Date(item.createdAt).toLocaleString()}</time></article>)}{items.length === 0 && <p>No enquiries yet.</p>}</div>}</div>;
}
