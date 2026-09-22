"use client";

import { useEffect, useState } from "react";

const blank = { about: { title: "", intro: "", mission: "", vision: "", stats: [], values: [], team: [] }, contact: { title: "", intro: "", email: "", phone: "", address: "", mapUrl: "" }, services: [], industries: [], policies: [] };
export default function AdminContentPage() {
  const [content, setContent] = useState<any>(blank);
  const [structured, setStructured] = useState({ services: "[]", industries: "[]", policies: "[]", stats: "[]", values: "[]", team: "[]" });
  const [status, setStatus] = useState("");
  useEffect(() => { fetch("/api/content").then(r => r.json()).then(({ content: c }) => { if (!c) return; setContent(c); setStructured({ services: JSON.stringify(c.services ?? [], null, 2), industries: JSON.stringify(c.industries ?? [], null, 2), policies: JSON.stringify(c.policies ?? [], null, 2), stats: JSON.stringify(c.about?.stats ?? [], null, 2), values: JSON.stringify(c.about?.values ?? [], null, 2), team: JSON.stringify(c.about?.team ?? [], null, 2) }); }); }, []);
  function field(section: "about" | "contact", key: string, value: string) { setContent((current: any) => ({ ...current, [section]: { ...current[section], [key]: value } })); }
  async function save(event: React.FormEvent) {
    event.preventDefault(); setStatus("Saving…");
    try {
      const body = { ...content, about: { ...content.about, stats: JSON.parse(structured.stats), values: JSON.parse(structured.values), team: JSON.parse(structured.team) }, services: JSON.parse(structured.services), industries: JSON.parse(structured.industries), policies: JSON.parse(structured.policies) };
      const response = await fetch("/api/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error); setStatus("Saved");
    } catch (error) { setStatus(error instanceof Error ? error.message : "Invalid JSON or save failed"); }
  }
  const input = "w-full rounded-md border px-3 py-2";
  return <form onSubmit={save} className="max-w-5xl space-y-8"><div><h1 className="text-2xl font-bold">Company content</h1><p className="mt-1 text-sm text-gray-500">Edit public company pages. Structured lists use JSON for a compact first-release CMS.</p></div>
    <section className="space-y-3 rounded-xl border p-5"><h2 className="text-lg font-semibold">About</h2>{["title", "intro", "mission", "vision"].map(key => <label key={key} className="block text-sm capitalize">{key}<textarea className={`${input} mt-1`} rows={key === "title" ? 1 : 3} value={content.about?.[key] ?? ""} onChange={e => field("about", key, e.target.value)} /></label>)}<JsonField label="Stats" value={structured.stats} onChange={value => setStructured(s => ({ ...s, stats: value }))} /><JsonField label="Values" value={structured.values} onChange={value => setStructured(s => ({ ...s, values: value }))} /><JsonField label="Team" value={structured.team} onChange={value => setStructured(s => ({ ...s, team: value }))} /></section>
    <section className="space-y-3 rounded-xl border p-5"><h2 className="text-lg font-semibold">Contact</h2>{["title", "intro", "email", "phone", "address", "mapUrl"].map(key => <label key={key} className="block text-sm capitalize">{key}<input className={`${input} mt-1`} value={content.contact?.[key] ?? ""} onChange={e => field("contact", key, e.target.value)} /></label>)}</section>
    <JsonField label="Services" value={structured.services} onChange={value => setStructured(s => ({ ...s, services: value }))} /><JsonField label="Industries" value={structured.industries} onChange={value => setStructured(s => ({ ...s, industries: value }))} /><JsonField label="Policies" value={structured.policies} onChange={value => setStructured(s => ({ ...s, policies: value }))} />
    <div className="flex items-center gap-4"><button className="rounded-md bg-primary px-5 py-2 text-primary-foreground">Save content</button><span className="text-sm">{status}</span></div>
  </form>;
}
function JsonField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <section className="rounded-xl border p-5"><label className="block text-lg font-semibold">{label}<textarea spellCheck={false} className="mt-3 min-h-48 w-full rounded-md border bg-gray-50 p-3 font-mono text-xs" value={value} onChange={e => onChange(e.target.value)} /></label></section>; }
