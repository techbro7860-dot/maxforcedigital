import type { Metadata } from "next";
import { getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = { title: "About Us | Maxforce Digital" };
export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const { about } = await getSiteContent();
  return <main className="mx-auto max-w-6xl px-5 py-16">
    <div className="max-w-3xl"><p className="mb-3 font-semibold text-primary">MAXFORCE DIGITAL</p><h1 className="text-4xl font-bold sm:text-5xl">{about.title}</h1><p className="mt-6 text-lg leading-8 text-gray-600">{about.intro}</p></div>
    <div className="mt-12 grid gap-6 md:grid-cols-2">
      <section className="rounded-2xl bg-gray-50 p-7"><h2 className="text-2xl font-bold">Our mission</h2><p className="mt-3 leading-7 text-gray-600">{about.mission}</p></section>
      <section className="rounded-2xl bg-gray-50 p-7"><h2 className="text-2xl font-bold">Our vision</h2><p className="mt-3 leading-7 text-gray-600">{about.vision}</p></section>
    </div>
    {about.stats?.length > 0 && <section className="mt-12 grid gap-4 sm:grid-cols-3">{about.stats.map((stat: any) => <div key={`${stat.value}-${stat.label}`} className="rounded-xl border p-6"><strong className="text-3xl text-primary">{stat.value}</strong><p className="mt-1 text-gray-600">{stat.label}</p></div>)}</section>}
    {about.values?.length > 0 && <section className="mt-16"><p className="font-semibold text-primary">WHY PARTNER WITH MAXFORCE?</p><h2 className="mt-2 text-3xl font-bold">One team for technology and growth</h2><div className="mt-7 grid gap-6 md:grid-cols-2">{about.values.map((value: any) => <article key={value.title} className="rounded-2xl border p-6"><h3 className="text-xl font-semibold">{value.title}</h3><p className="mt-3 leading-7 text-gray-600">{value.description}</p></article>)}</div></section>}
    {about.team?.length > 0 && <section className="mt-16"><h2 className="text-3xl font-bold">Our team</h2><div className="mt-7 grid gap-6 md:grid-cols-3">{about.team.map((person: any) => <article key={person.name} className="rounded-2xl border p-6"><h3 className="text-xl font-semibold">{person.name}</h3><p className="text-primary">{person.role}</p><p className="mt-3 text-gray-600">{person.bio}</p></article>)}</div></section>}
  </main>;
}
