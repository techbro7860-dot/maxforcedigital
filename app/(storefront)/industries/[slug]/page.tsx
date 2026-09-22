import { notFound } from "next/navigation";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";
export default async function IndustryPage({ params }: { params: { slug: string } }) {
  const { industries } = await getSiteContent();
  const industry = industries.find((item: any) => item.slug === params.slug && item.isActive);
  if (!industry) notFound();
  return <main className="mx-auto max-w-4xl px-5 py-16"><p className="font-semibold text-primary">INDUSTRIES</p><h1 className="mt-3 text-4xl font-bold">{industry.title}</h1><p className="mt-5 text-xl text-gray-600">{industry.summary}</p><div className="mt-10 whitespace-pre-line leading-8 text-gray-700">{industry.body}</div>{industry.features.length > 0 && <ul className="mt-10 space-y-3">{industry.features.map((feature: string) => <li key={feature}>✓ {feature}</li>)}</ul>}</main>;
}
